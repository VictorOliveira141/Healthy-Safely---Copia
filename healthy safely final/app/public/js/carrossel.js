let index = 0;
const slides = document.querySelectorAll(".slide");

function mostrarSlide(n) {
  slides.forEach((s) => s.classList.remove("ativo"));
  slides[n].classList.add("ativo");
}

setInterval(() => {
  index = (index + 1) % slides.length;
  mostrarSlide(index);
}, 4000); // Troca a cada 4 segundos
