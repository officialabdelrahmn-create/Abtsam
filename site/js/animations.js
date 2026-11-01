/* Motion layer: scroll reveals, split headings, parallax, counters, progress bar.
   One IntersectionObserver for reveals, one rAF loop for everything scroll/mouse driven. */
(() => {
  "use strict";
  const q = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const setCount = (el, v) => { el.textContent = (el.dataset.p || "") + v + (el.dataset.s || ""); };

  // ---------- counters ----------
  const counters = q("[data-n]");
  if (reduced) {
    counters.forEach(el => setCount(el, +el.dataset.n));
  } else {
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const el = e.target, n = +el.dataset.n, t0 = performance.now();
      const tick = t => {
        const p = clamp((t - t0) / 1800, 0, 1);
        setCount(el, Math.round(n * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    counters.forEach(e => co.observe(e));
  }

  if (reduced) return; // everything below is motion-only

  // ---------- split headings into masked words (whole words only, so Arabic letters keep joining) ----------
  const splitWords = root => {
    let i = 0;
    root.setAttribute("aria-label", root.textContent.replace(/\s+/g, " ").trim());
    const walk = node => [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) return f.appendChild(document.createTextNode(" "));
          const w = document.createElement("span"), wi = document.createElement("span");
          w.className = "w"; wi.className = "wi";
          wi.style.setProperty("--i", i++); wi.textContent = p;
          w.appendChild(wi); f.appendChild(w);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1) walk(c);
    });
    walk(root);
  };

  const hero = q(".hero")[0];
  const heroTitle = q(".hero h1")[0];
  if (heroTitle) splitWords(heroTitle);

  // ---------- tag reveal targets ----------
  const tag = (sel, type, delay) => q(sel).forEach((el, i) => {
    el.classList.add("an"); el.dataset.a = type;
    const d = delay ? delay(i) : 0;
    if (d) el.style.setProperty("--dl", d + "s");
  });
  q(".sec h2").forEach(h => { splitWords(h); h.classList.add("an"); h.dataset.a = "words"; });
  tag(".sub, .promo p, .head .arrows, .copy", "u", () => 0.15);
  tag(".stats > div", "u", i => i * 0.12);
  tag(".card", "clip", i => (i % 3) * 0.14);
  tag(".rv", "u", i => (i % 3) * 0.1);
  tag(".ba", "wipe", i => (i % 2) * 0.14);
  tag(".bat", "u", i => (i % 2) * 0.14 + 0.25);
  tag(".gallery figure", "clip", i => (i % 4) * 0.1);
  tag(".video", "clip");
  tag(".form", "u", () => 0.15);
  tag(".acc", "u", i => Math.min(i, 6) * 0.06);
  tag(".fgrid > div", "u", i => i * 0.1);

  const markDone = el => el.classList.add("done");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    io.unobserve(el);
    el.classList.add("in");
    const onEnd = ev => {
      if (ev.target === el && /^(opacity|transform|mask-size|-webkit-mask-size)$/.test(ev.propertyName)) {
        el.removeEventListener("transitionend", onEnd); markDone(el);
      }
    };
    el.addEventListener("transitionend", onEnd);
    setTimeout(() => markDone(el), 3500 + (parseFloat(el.style.getPropertyValue("--dl")) || 0) * 1000); // fallback
  }), { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  q(".an").forEach(el => io.observe(el));

  // ---------- parallax + progress + hero mouse (single rAF loop) ----------
  const bar = document.getElementById("progress");
  const heroTxt = q(".hero-txt")[0], docs = q(".docs-wrap")[0], blobs = q(".blob");
  const items = [];
  q(".card").forEach(c => { const img = c.querySelector("img"); if (img) items.push({ el: img, host: c, k: 0.075 }); });
  q(".video").forEach(v => { const img = v.querySelector("img"); if (img) items.push({ el: img, host: v, k: 0.075 }); });
  const visible = new Set();
  const vio = new IntersectionObserver(es => es.forEach(e => {
    items.forEach(it => { if (it.host === e.target) e.isIntersecting ? visible.add(it) : visible.delete(it); });
    request();
  }), { rootMargin: "10% 0px" });
  new Set(items.map(i => i.host)).forEach(h => vio.observe(h));

  let ticking = false, mx = 0, my = 0, cx = 0, cy = 0, heroH = hero ? hero.offsetHeight : 0;
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };

  function frame() {
    ticking = false;
    const sy = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp(sy / max, 0, 1) : 0})`;

    // read phase
    const ys = [];
    visible.forEach(it => {
      const r = it.host.getBoundingClientRect();
      const p = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
      ys.push([it.el, -p * r.height * it.k]);
    });
    // write phase
    ys.forEach(([el, y]) => { el.style.translate = `0 ${y.toFixed(1)}px`; });

    cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08;
    if (hero && (sy < heroH * 1.5 || Math.abs(cx) > 0.001)) {
      if (heroTxt) heroTxt.style.translate = `0 ${(sy * 0.08).toFixed(1)}px`;
      if (docs) docs.style.translate = `${(cx * -14).toFixed(1)}px ${(cy * -8 + sy * 0.03).toFixed(1)}px`;
      blobs.forEach((b, i) => { b.style.translate = `${(cx * (i ? -50 : 60)).toFixed(1)}px ${(cy * 40 + sy * (i ? -0.1 : 0.16)).toFixed(1)}px`; });
    }
    if (Math.abs(mx - cx) > 0.001 || Math.abs(my - cy) > 0.001) request();
  }

  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", () => { heroH = hero ? hero.offsetHeight : 0; request(); }, { passive: true });
  if (hero && finePointer) {
    hero.addEventListener("mousemove", e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; request(); });
    hero.addEventListener("mouseleave", () => { mx = my = 0; request(); });
  }
  request();

  // ---------- booking modal: animate only when the step actually changes ----------
  if (typeof render === "function" && typeof S !== "undefined") {
    const base = render, bodyEl = document.getElementById("body");
    let last = -1;
    window.render = function () {
      const changed = S.step !== last;
      last = S.step;
      base.apply(this, arguments);
      if (changed) { bodyEl.classList.remove("step-in"); void bodyEl.offsetWidth; bodyEl.classList.add("step-in"); }
    };
  }
})();
