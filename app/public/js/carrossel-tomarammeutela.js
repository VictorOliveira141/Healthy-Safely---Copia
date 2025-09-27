document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carrossel-slide");
  const prevBtn = document.querySelector(".botao-prev");
  const nextBtn = document.querySelector(".botao-next");
  let slideIndex = 0;
  function showSlide(n) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === n);
    });
    slideIndex = n;
  }
  prevBtn.addEventListener("click", () => {
    let nextIndex = slideIndex - 1 < 0 ? slides.length - 1 : slideIndex - 1;
    showSlide(nextIndex);
  });
  nextBtn.addEventListener("click", () => {
    let nextIndex = (slideIndex + 1) % slides.length;
    showSlide(nextIndex);
  });
  setInterval(() => {
    let nextIndex = (slideIndex + 1) % slides.length;
    showSlide(nextIndex);
  }, 5000);
});
