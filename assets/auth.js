/* ============================================================
   VeilBrowser — shared auth (Supabase)
   YEHI account system website AUR software — dono me chalega.
   Signup kahin se bhi ho (site ya app), login dono jagah hoga.
   ============================================================ */
(function () {
  var cfg = window.VB_CONFIG || {};
  var configured =
    cfg.SUPABASE_URL && cfg.SUPABASE_URL.indexOf("PASTE_") !== 0 &&
    cfg.SUPABASE_ANON_KEY && cfg.SUPABASE_ANON_KEY.indexOf("PASTE_") !== 0;

  var client = null;
  if (configured && window.supabase) {
    client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  window.VB = {
    configured: configured,
    client: client,

    getSession: function () {
      if (!client) return Promise.resolve(null);
      return client.auth.getSession().then(function (r) {
        return r.data ? r.data.session : null;
      });
    },

    signUp: function (email, password) {
      return client.auth.signUp({
        email: email,
        password: password,
        options: { emailRedirectTo: window.location.origin + "/auth.html" }
      });
    },

    signIn: function (email, password) {
      return client.auth.signInWithPassword({ email: email, password: password });
    },

    signOut: function () {
      if (!client) return Promise.resolve();
      return client.auth.signOut();
    },

    resetPassword: function (email) {
      return client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password.html"
      });
    },

    updatePassword: function (newPassword) {
      return client.auth.updateUser({ password: newPassword });
    },

    requireAuth: function () {
      return this.getSession().then(function (session) {
        if (!session) window.location.href = "auth.html";
        return session;
      });
    }
  };

  /* Navbar ko login state ke hisab se badlo */
  function paintNav(session) {
    var slot = document.getElementById("nav-auth");
    if (!slot) return;
    if (session) {
      slot.innerHTML =
        '<a class="btn btn-ghost btn-sm" href="dashboard.html">Dashboard</a>' +
        '<button class="btn btn-grad btn-sm" id="nav-logout" type="button">Log out</button>';
      var b = document.getElementById("nav-logout");
      if (b) b.addEventListener("click", function () {
        window.VB.signOut().then(function () { window.location.href = "index.html"; });
      });
    } else {
      slot.innerHTML =
        '<a class="btn btn-ghost btn-sm" href="auth.html">Log in</a>' +
        '<a class="btn btn-grad btn-sm" href="auth.html#signup">Sign up free</a>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("nav-auth")) return;
    if (!configured) { paintNav(null); return; }
    window.VB.getSession().then(paintNav);
    if (client) client.auth.onAuthStateChange(function (_e, session) { paintNav(session); });
  });
})();
