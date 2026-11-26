(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- scroll reveal ---------- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rv.forEach(function (el, i) { el.style.transitionDelay = ((i % 6) * 70) + "ms"; io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- count-up numbers ---------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    if (reduce || !("IntersectionObserver" in window)) { el.textContent = end; return; }
    var seen = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; seen.disconnect();
      var t0 = performance.now(), dur = 1400;
      (function step(t) {
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * e);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: 0.6 });
    seen.observe(el);
  });

  if (reduce || !fine) { /* keep it calm on touch / reduced motion */ }

  /* ---------- hero scene tilt ---------- */
  var scene = document.querySelector(".scene");
  if (scene && fine && !reduce) {
    var hero = document.querySelector(".hero"), raf = 0, tx = 0, ty = 0;
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        scene.style.transform = "rotateY(" + (tx * 9).toFixed(2) + "deg) rotateX(" + (-ty * 7).toFixed(2) + "deg)";
      });
    });
    hero.addEventListener("mouseleave", function () { scene.style.transform = ""; });
  }

  /* ---------- card tilt ---------- */
  if (fine && !reduce) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 9).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 11).toFixed(2) + "deg) translateZ(6px)";
        el.style.setProperty("--mx", (x * 100) + "%"); el.style.setProperty("--my", (y * 100) + "%");
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- header shadow ---------- */
  var hd = document.querySelector(".site-header");
  if (hd) addEventListener("scroll", function () { hd.classList.toggle("scrolled", scrollY > 8); }, { passive: true });

  /* ---------- hero graph canvas (echoes Obsidian's graph view) ---------- */
  var cv = document.getElementById("graph");
  if (!cv || reduce) return;
  var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1), nodes = [], running = true, mouse = { x: -999, y: -999 };
  var COLORS = ["#5fd4b4", "#6ea2ee", "#e8b448"];
  function size() {
    var r = cv.parentElement.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = W < 700 ? 38 : 72; nodes = [];
    for (var i = 0; i < n; i++) {
      var k = i < n * 0.55 ? 0 : (i < n * 0.8 ? 1 : 2);
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: k === 0 ? 3.2 : 2.4, c: COLORS[k] });
    }
  }
  function frame() {
    if (running) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
        var dx = a.x - mouse.x, dy = a.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { a.x += dx * 0.004; a.y += dy * 0.004; }
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], ex = a.x - b.x, ey = a.y - b.y, d = ex * ex + ey * ey;
          if (d < 16900) {
            ctx.strokeStyle = "rgba(180,230,215," + (0.22 * (1 - d / 16900)).toFixed(3) + ")";
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k]; ctx.fillStyle = n.c; ctx.globalAlpha = .85;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(frame);
  }
  size(); addEventListener("resize", size);
  cv.parentElement.addEventListener("mousemove", function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { running = es[0].isIntersecting; }).observe(cv);
  frame();
})();
