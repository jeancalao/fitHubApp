// ============================================================
//  Workout Detail Screen — timer-based exercise player
// ============================================================

const WorkoutDetailScreen = {
  _day: null,
  _exIdx: 0,
  _timeLeft: 0,
  _totalTime: 0,
  _timer: null,
  _running: false,

  // SVG circle circumference for r=52: 2 * π * 52 ≈ 326.7
  _CIRC: 2 * Math.PI * 52,

  init(data) {
    this._day    = data.day;
    this._exIdx  = 0;
    this._running = false;
    this._clearTimer();
    this._loadExercise();
    this._bindControls();
  },

  cleanup() {
    this._clearTimer();
    this._running = false;
  },

  _clearTimer() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  },

  _loadExercise() {
    const exercises = this._day.exercises;
    const ex = exercises[this._exIdx];

    // Header
    document.getElementById('workout-detail-title').textContent =
      `${this._day.title} — ${this._exIdx + 1}/${exercises.length}`;

    // Exercise info
    document.getElementById('exercise-name').textContent = ex.name;
    document.getElementById('exercise-desc').textContent = ex.description;

    // Image
    const img = document.getElementById('exercise-img');
    const fallback = document.getElementById('exercise-icon-fallback');
    img.style.display = 'block';
    fallback.style.display = 'none';
    img.src = ex.imageUrl || '';
    if (!ex.imageUrl) { img.style.display = 'none'; fallback.style.display = 'flex'; }

    // Timer
    this._timeLeft   = ex.durationSeconds;
    this._totalTime  = ex.durationSeconds;
    this._running    = false;
    this._updateTimerUI();
    this._updatePlayIcon();

    // Skip button label
    const skipBtn = document.getElementById('btn-skip-exercise');
    skipBtn.textContent = this._exIdx === exercises.length - 1 ? 'Finalizar Treino' : 'Pular / Próximo';
  },

  _updateTimerUI() {
    const secs  = this._timeLeft;
    const mm    = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss    = String(secs % 60).padStart(2, '0');
    document.getElementById('timer-text').textContent = `${mm}:${ss}`;

    const progress = document.getElementById('timer-progress');
    const ratio    = this._totalTime > 0 ? secs / this._totalTime : 0;
    const offset   = this._CIRC * (1 - ratio);
    progress.style.strokeDasharray  = this._CIRC;
    progress.style.strokeDashoffset = offset;
  },

  _updatePlayIcon() {
    const icon = document.getElementById('play-pause-icon');
    icon.className = this._running ? 'fas fa-pause' : 'fas fa-play';
  },

  _togglePlay() {
    this._running = !this._running;
    this._updatePlayIcon();
    if (this._running) {
      this._timer = setInterval(() => this._tick(), 1000);
    } else {
      this._clearTimer();
    }
  },

  _tick() {
    if (this._timeLeft <= 0) {
      this._clearTimer();
      this._running = false;
      this._advance();
      return;
    }
    this._timeLeft--;
    this._updateTimerUI();
  },

  _advance() {
    const exercises = this._day.exercises;
    if (this._exIdx < exercises.length - 1) {
      this._exIdx++;
      this._loadExercise();
    } else {
      this._finishWorkout();
    }
  },

  _finishWorkout() {
    this._clearTimer();
    Workout.markDayCompleted(this._day.id);

    App.showModal({
      icon: 'fa-trophy',
      title: 'Parabéns! 🎉',
      message: 'Você concluiu o treino de hoje! Continue assim e alcance seus objetivos.',
      btnLabel: 'Ir para o Dashboard',
      onClose: () => App.show('dashboard'),
    });
  },

  _bindControls() {
    // Play/Pause
    const playBtn  = document.getElementById('btn-play-pause');
    const playClone = playBtn.cloneNode(true);
    playBtn.replaceWith(playClone);
    playClone.addEventListener('click', () => this._togglePlay());

    // Skip
    const skipBtn  = document.getElementById('btn-skip-exercise');
    const skipClone = skipBtn.cloneNode(true);
    skipBtn.replaceWith(skipClone);
    skipClone.addEventListener('click', () => {
      this._clearTimer();
      this._running = false;
      this._advance();
    });

    // Back button
    const backBtn  = document.getElementById('btn-workout-back');
    const backClone = backBtn.cloneNode(true);
    backBtn.replaceWith(backClone);
    backClone.addEventListener('click', () => {
      this._clearTimer();
      App.show('dashboard');
    });
  },
};
