// ============================================================
//  FITHUB - Router / Screen Manager
// ============================================================

const App = {
  _current: null,

  screens: {
    splash:           'screen-splash',
    intro:            'screen-intro',
    questionnaire:    'screen-questionnaire',
    planGeneration:   'screen-plan-generation',
    dashboard:        'screen-dashboard',
    workoutDetail:    'screen-workout-detail',
    workoutEditor:    'screen-workout-editor',
  },

  // Map screen name → init function
  _inits: {
    splash:         () => SplashScreen.init(),
    intro:          () => IntroScreen.init(),
    questionnaire:  () => QuestionnaireScreen.init(),
    planGeneration: (data) => PlanGenerationScreen.init(data),
    dashboard:      () => DashboardScreen.init(),
    workoutDetail:  (data) => WorkoutDetailScreen.init(data),
    workoutEditor:  (data) => WorkoutEditorScreen.init(data),
  },

  show(name, data) {
    // Stop any running workout timer if navigating away
    if (this._current === 'workoutDetail' && name !== 'workoutDetail') {
      WorkoutDetailScreen.cleanup && WorkoutDetailScreen.cleanup();
    }

    // Hide all screens
    Object.values(this.screens).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const targetId = this.screens[name];
    if (!targetId) { console.error('Unknown screen:', name); return; }

    const el = document.getElementById(targetId);
    if (el) el.classList.remove('hidden');

    this._current = name;
    if (this._inits[name]) this._inits[name](data);
  },

  showModal({ icon = 'fa-trophy', title, message, btnLabel = 'OK', onClose }) {
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-icon-i').className = `fas ${icon}`;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    const btn = document.getElementById('modal-btn');
    btn.textContent = btnLabel;
    overlay.classList.remove('hidden');

    const close = () => {
      overlay.classList.add('hidden');
      btn.removeEventListener('click', close);
      if (onClose) onClose();
    };
    btn.addEventListener('click', close);
  },

  showToast(msg, duration = 2500) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), duration);
  },
};

// Boot
document.addEventListener('DOMContentLoaded', () => {
  App.show('splash');
});
