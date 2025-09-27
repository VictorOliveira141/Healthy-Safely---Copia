document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".slides-wrapper");
  const track = document.querySelector(".slides");
  const prevBtn = document.querySelector(".ml-prev");
  const nextBtn = document.querySelector(".ml-next");
  const isMobile = window.matchMedia("(max-width: 650px)").matches;
  if (!wrapper || !track || isMobile) return;
  wrapper.style.justifyContent = "flex-start";
  let gap = 0,
    itemW = 0,
    step = 0,
    perView = 1,
    current = 0;
  function medir() {
    const primeiro = track.querySelector(".produtos");
    if (!primeiro) return;
    const st = getComputedStyle(track);
    gap = parseFloat(st.columnGap || st.gap) || 0;
    itemW = primeiro.getBoundingClientRect().width;
    step = Math.round(itemW + gap);
    const ww = wrapper.clientWidth;
    perView = Math.max(1, Math.floor((ww + gap) / step));
  }
  function maxIndex() {
    return Math.max(0, track.children.length - perView);
  }
  function atualizarBotoes() {
    if (prevBtn) prevBtn.disabled = current <= 0;
    if (nextBtn) nextBtn.disabled = current >= maxIndex();
  }
  function irPara(i) {
    current = Math.max(0, Math.min(i, maxIndex()));
    track.style.transform = `translateX(${-current * step}px)`;
    atualizarBotoes();
  }
  medir();
  irPara(0);
  nextBtn?.addEventListener("click", () => irPara(current + 1));
  prevBtn?.addEventListener("click", () => irPara(current - 1));
  window.addEventListener("resize", () => {
    if (window.matchMedia("(max-width: 650px)").matches) return;
    medir();
    if (current > maxIndex()) current = maxIndex();
    irPara(current);
  });
});
