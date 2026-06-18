/* ============================================================
   Мария · Portfolio interactions
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Scroll reveals + count-up trigger ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
    document.querySelectorAll("[data-target]").forEach(setFinalValue);
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          entry.target.querySelectorAll("[data-target]").forEach(countUp);
          if (entry.target.matches("[data-target]")) countUp(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- 2. Number count-up ---------- */
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const target = parseFloat(el.dataset.target);
    if (Number.isNaN(target)) return;
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setFinalValue(el) {
    const target = parseFloat(el.dataset.target);
    if (Number.isNaN(target)) return;
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    el.textContent = (el.dataset.prefix || "") + target.toFixed(decimals) + (el.dataset.suffix || "");
  }

  /* ---------- 3. Hero — reference for dock visibility ---------- */
  const hero = document.querySelector(".hero");

  /* ---------- 4. Dock — hidden on hero, visible after scroll ---------- */
  const dock = document.querySelector(".dock");

  if (dock) {
    const heroHeight = () => hero ? hero.offsetHeight : window.innerHeight;

    const checkDock = () => {
      const past = window.scrollY > heroHeight() * 0.6;
      dock.classList.toggle("dock--visible", past);
    };

    window.addEventListener("scroll", checkDock, { passive: true });
    checkDock(); // initial state
  }

  /* ---------- 5. Gallery + Cases — drag to scroll ---------- */
  [".gallery__strip", ".cases__slider-wrap"].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;

    /* drag */
    let isDown = false, startX = 0, scrollLeft = 0;
    el.addEventListener("mousedown", (e) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; });
    el.addEventListener("mouseleave", () => { isDown = false; });
    el.addEventListener("mouseup", () => { isDown = false; });
    el.addEventListener("mousemove", (e) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX); });

    /* wheel: horizontal → strip, vertical → page */
    el.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return; // let vertical pass through
      e.preventDefault();
      el.scrollLeft += e.deltaX || e.deltaY;
    }, { passive: false });
  });

})();
