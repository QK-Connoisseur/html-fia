
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu){
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Send forms via user's email client to info@fiacleaningmasters.com
  function serializeForm(form) {
    const data = new FormData(form);
    const lines = [];
    for (const [key, value] of data.entries()) { lines.push(`${key}: ${value}`); }
    return encodeURIComponent(lines.join('\r\n'));
  }
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!form.classList.contains('form')) return;
    e.preventDefault();
    const subject = encodeURIComponent(form.getAttribute('data-subject') || 'Website Request');
    const body = serializeForm(form);
    const mailto = `mailto:info@fiacleaningmasters.com?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  });

  // Lightweight testimonial carousel
  function initTestimonialCarousel(carousel){
    const track = carousel.querySelector('[data-carousel-track]');
    if (!track) return;
    const slides = Array.from(track.children);
    if (!slides.length) return;
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
    let index = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (index < 0) index = 0;

    function setSlide(target){
      index = (target + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
      });
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    const goPrev = () => setSlide(index - 1);
    const goNext = () => setSlide(index + 1);

    if (prev) prev.addEventListener('click', goPrev);
    if (next) next.addEventListener('click', goNext);
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => setSlide(dotIndex));
    });

    let autoTimer = null;
    const stopAuto = () => {
      if (autoTimer){
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    };
    const startAuto = () => {
      stopAuto();
      autoTimer = window.setInterval(goNext, 7000);
    };
    const restartAuto = () => {
      stopAuto();
      startAuto();
    };

    [prev, next, ...dots].forEach((control) => {
      if (!control) return;
      control.addEventListener('click', restartAuto);
    });

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) startAuto();
    });
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft'){
        event.preventDefault();
        goPrev();
        restartAuto();
      } else if (event.key === 'ArrowRight'){
        event.preventDefault();
        goNext();
        restartAuto();
      }
    });

    setSlide(index);
    startAuto();
  }

  document.querySelectorAll('[data-carousel]').forEach(initTestimonialCarousel);
})();
