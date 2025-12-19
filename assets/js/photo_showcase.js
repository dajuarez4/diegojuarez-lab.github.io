(() => {
  function start() {
    const root = document.getElementById("photo-showcase");
    if (!root) return;

    const main  = document.getElementById("ps-main");
    const mini1 = document.getElementById("ps-mini-1");
    const mini2 = document.getElementById("ps-mini-2");
    const mini3 = document.getElementById("ps-mini-3");
    if (!main) return;

    const dots = Array.from(root.querySelectorAll(".ps-dot"));

    const jsonEl = document.getElementById("ps-photos-json");
    if (!jsonEl) return;

    let PS_PHOTOS = [];
    try { PS_PHOTOS = JSON.parse(jsonEl.textContent.trim()); } catch(e){ return; }
    if (!Array.isArray(PS_PHOTOS) || PS_PHOTOS.length === 0) return;

    // Preload
    PS_PHOTOS.forEach(p => { const img = new Image(); img.src = p.src; });

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const FADE_MS = prefersReduced ? 0 : 450;
    const HOLD_MS = 10000; // prueba rápido: pon 2000

    let lastSet = new Set();

    function shuffle(arr){
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function pickDistinct(k){
      const indices = shuffle([...Array(PS_PHOTOS.length).keys()]);
      const picks = [];
      for (const idx of indices){
        if (!lastSet.has(idx)){
          picks.push(idx);
          if (picks.length === k) break;
        }
      }
      if (picks.length < k){
        for (const idx of indices){
          if (!picks.includes(idx)){
            picks.push(idx);
            if (picks.length === k) break;
          }
        }
      }
      return picks;
    }

    function swapImage(el, photo){
      if (!el) return;
      if (!prefersReduced) el.classList.add("is-leaving");
      setTimeout(() => {
        el.src = photo.src;
        el.alt = photo.alt || "";
        if (!prefersReduced) el.classList.remove("is-leaving");
      }, FADE_MS);
    }

    function tick(){
      const picks = pickDistinct(Math.min(4, PS_PHOTOS.length));
      lastSet = new Set(picks);

      const p0 = PS_PHOTOS[picks[0]];
      const p1 = PS_PHOTOS[picks[1] ?? picks[0]];
      const p2 = PS_PHOTOS[picks[2] ?? picks[0]];
      const p3 = PS_PHOTOS[picks[3] ?? picks[0]];

      swapImage(main,  p0);
      swapImage(mini1, p1);
      swapImage(mini2, p2);
      swapImage(mini3, p3);

      if (dots.length){
        const on = Math.floor(Math.random() * dots.length);
        dots.forEach((d,i)=>d.classList.toggle("is-on", i === on));
      }
    }

    setTimeout(tick, 800);
    setInterval(tick, HOLD_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
