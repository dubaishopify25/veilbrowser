/* VeilBrowser — 3D live effects (vanilla JS, no library) */
(function () {
  /* 1) 3D tilt — hero browser mockup mouse ke sath ghumta hai */
  var stage = document.querySelector(".stage");
  var mock = document.querySelector(".mock3d");
  if (stage && mock) {
    stage.addEventListener("mousemove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      mock.style.transform = "rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 8).toFixed(2) + "deg)";
    });
    stage.addEventListener("mouseleave", function () {
      mock.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  /* 2) Feature cards par halka 3D tilt */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "perspective(800px) rotateY(" + (x * 6).toFixed(2) + "deg) rotateX(" + (-y * 6).toFixed(2) + "deg) translateY(-3px)";
    });
    card.addEventListener("mouseleave", function () { card.style.transform = ""; });
  });

  /* 3) Scroll reveal */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

  /* 4) Animated counters */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, end = parseFloat(el.getAttribute("data-count")), t0 = null;
      function tick(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1200, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });
})();
