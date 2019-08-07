var slideIndex = 0;

function prevSlide() {
  var slides = document.getElementsByClassName("slide");
  slides[slideIndex].style.display = "none";
  slideIndex--;
  if (slideIndex < 0) {
    slideIndex = slides.length - 1;
  }
  slides[slideIndex].style.display = "block";
}

function nextSlide() {
  var slides = document.getElementsByClassName("slide");
  slides[slideIndex].style.display = "none";
  slideIndex++;
  if (slideIndex == slides.length) {
    slideIndex = 0;
  }
  slides[slideIndex].style.display = "block";
}

