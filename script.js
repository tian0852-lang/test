const track = document.querySelector('#bannerTrack');
const viewport = document.querySelector('#bannerViewport');
const dots = [...document.querySelectorAll('.dot')];
const pauseButton = document.querySelector('#pauseButton');
const nextButton = document.querySelector('#nextButton');
const prevButton = document.querySelector('#prevButton');
const slides = [...document.querySelectorAll('.banner__slide')];

let activeIndex = 0;
let isPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoplayTimer;

function render(index) {
  activeIndex = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${activeIndex * 100}%)`;
  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', isActive);
  });
}

function stopAutoplay() {
  window.clearInterval(autoplayTimer);
  autoplayTimer = undefined;
}

function startAutoplay() {
  stopAutoplay();
  if (!isPaused) autoplayTimer = window.setInterval(() => render(activeIndex + 1), 5000);
}

function showNext() {
  render(activeIndex + 1);
  startAutoplay();
}

function showPrevious() {
  render(activeIndex - 1);
  startAutoplay();
}

nextButton.addEventListener('click', showNext);
prevButton.addEventListener('click', showPrevious);

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    render(index);
    startAutoplay();
  });
});

pauseButton.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseButton.setAttribute('aria-pressed', String(isPaused));
  pauseButton.innerHTML = isPaused
    ? '<span aria-hidden="true">▶</span><span>播放</span>'
    : '<span aria-hidden="true">Ⅱ</span><span>暂停</span>';
  startAutoplay();
});

viewport.addEventListener('mouseenter', stopAutoplay);
viewport.addEventListener('mouseleave', startAutoplay);
viewport.addEventListener('focusin', stopAutoplay);
viewport.addEventListener('focusout', startAutoplay);
viewport.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') showNext();
  if (event.key === 'ArrowLeft') showPrevious();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAutoplay();
  else startAutoplay();
});

render(0);
startAutoplay();
