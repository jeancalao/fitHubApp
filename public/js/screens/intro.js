// ============================================================
//  Intro Slides Screen
// ============================================================

const IntroScreen = {
  _current: 0,
  _total: 3,

  init() {
    this._current = 0;
    this._render();
    this._bindEvents();
  },

  _render() {
    const slides = document.getElementById('intro-slides');
    slides.style.transform = `translateX(-${this._current * 100}%)`;

    const dots = document.querySelectorAll('#intro-dots .dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === this._current));

    const nextBtn = document.getElementById('intro-next');
    nextBtn.textContent = this._current === this._total - 1 ? 'Começar' : 'Próximo';
  },

  _bindEvents() {
    const nextBtn = document.getElementById('intro-next');
    const skipBtn = document.getElementById('intro-skip');

    // Clone to remove stale listeners
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    skipBtn.replaceWith(skipBtn.cloneNode(true));

    document.getElementById('intro-next').addEventListener('click', () => {
      if (this._current < this._total - 1) {
        this._current++;
        this._render();
      } else {
        App.show('questionnaire');
      }
    });

    document.getElementById('intro-skip').addEventListener('click', () => {
      App.show('questionnaire');
    });
  },
};
