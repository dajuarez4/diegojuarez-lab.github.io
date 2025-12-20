(() => {
  function start() {
    const root = document.getElementById("photo-showcase");
    if (!root) return;

    const imgEl = document.getElementById("psc-img");
    const prevBtn = document.getElementById("psc-prev");
    const nextBtn = document.getElementById("psc-next");
    const counterEl = document.getElementById("psc-counter");
    const dotsWrap = document.getElementById("psc-dots");
    const jsonEl = document.getElementById("ps-photos-json");

    if (!imgEl || !prevBtn || !nextBtn || !jsonEl) return;

    let PHOTOS = [];
    try {
      PHOTOS = JSON.parse(jsonEl.textContent.trim());
    } catch (e) {
      return;
    }
    if (!Array.isArray(PHOTOS) || PHOTOS.length === 0) return;

    // Preload
    PHOTOS.forEach(p => {
      const im = new Image();
      im.src = p.src;
    });

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const FADE_MS = prefersReduced ? 0 : 120;

    let i = 0;

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      PHOTOS.forEach((_, k) => {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "psc-dot";
        d.setAttribute("aria-label", `Go to photo ${k + 1}`);
        d.addEventListener("click", () => {
          i = k;
          render();
        });
        dotsWrap.appendChild(d);
      });
    }

    function setDots() {
      if (!dotsWrap) return;
      [...dotsWrap.children].forEach((d, k) => d.classList.toggle("is-on", k === i));
    }

    function render() {
      const p = PHOTOS[i];

      if (!prefersReduced) imgEl.classList.add("is-fading");
      setTimeout(() => {
        imgEl.src = p.src;
        imgEl.alt = p.alt || "";
        if (counterEl) counterEl.textContent = `${i + 1} / ${PHOTOS.length}`;
        setDots();
        if (!prefersReduced) imgEl.classList.remove("is-fading");
      }, FADE_MS);
    }

    function next() {
      i = (i + 1) % PHOTOS.length;
      render();
    }

    function prev() {
      i = (i - 1 + PHOTOS.length) % PHOTOS.length;
      render();
    }

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    // Keyboard arrows
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    buildDots();
    render();

    // OPTIONAL: auto-advance (uncomment)
    // setInterval(next, 6000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
