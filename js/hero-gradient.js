/* ============================================================
   Мария · Hero gradient (hero-canvas)
   ------------------------------------------------------------
   Один-в-один с референсом lukebaffait.fr: исходная картинка-
   градиент (assets/images/background.png)
   прогоняется через движок CoreRenderer с эффектами
   flow-field + blur + dither — точно тот же конфиг
   (window._heroProjectData из js/hero-project.js).
   ============================================================ */
(() => {
  "use strict";

  const hero = document.querySelector(".hero");
  if (!hero) return;

  // контейнер hero-canvas (как на референсе: absolute, inset:0, z-index:0)
  let container = hero.querySelector("#hero-canvas");
  if (!container) {
    container = document.createElement("div");
    container.className = "hero-canvas";
    container.id = "hero-canvas";
    container.setAttribute("aria-hidden", "true");
    hero.prepend(container);
  }

  if (typeof CoreRenderer === "undefined" || !window._heroProjectData) {
    console.error("CoreRenderer или _heroProjectData не загружены");
    return;
  }

  let lastMouseX = window.innerWidth / 2;
  let lastMouseY = window.innerHeight / 2;
  window.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }, { passive: true });

  // Конфиг отдаём через data:-URL, а не blob: — так он читается даже при
  // открытии страницы по file:// (у file:// «нулевой» origin, и fetch blob-URL
  // там может падать). data: грузится независимо от протокола.
  const json = JSON.stringify(window._heroProjectData);
  const projectSrc =
    "data:application/json;charset=utf-8," + encodeURIComponent(json);
  container.setAttribute("data-cr-project-src", projectSrc);

  CoreRenderer.init()
    .then(() => {
      // засеять позицию мыши, чтобы flow-field стартовал корректно
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: lastMouseX,
          clientY: lastMouseY,
          bubbles: true,
        })
      );
    })
    .catch((err) => {
      console.error("CoreRenderer init failed:", err);
    });
})();
