// ============================================================
//  FITHUB - Plan generation, streak & workout logic
// ============================================================

const Workout = {
  generatePlan(profile) {
    const secPerExercise = Math.floor((profile.availableTimeMinutes * 60) / 4);
    const useElastic = profile.equipment && profile.equipment.includes('elastico');
    const baseExercises = useElastic ? EXERCISES_ELASTIC : EXERCISES_BODYWEIGHT;

    const exercises = baseExercises.map(ex => ({
      ...ex,
      durationSeconds: secPerExercise,
    }));

    const workoutDays = ['A', 'B', 'C'].map((letter, idx) => ({
      id: `day_${letter}`,
      dayNumber: idx + 1,
      title: `Treino ${letter}`,
      exercises: exercises.map(ex => ({ ...ex })),
      isCompleted: false,
    }));

    const plan = {
      title: 'Plano Iniciante',
      description: `Focado em ${profile.objectiveLabel}`,
      workoutsPerWeek: 3,
      workoutDays,
    };

    Storage.savePlan(plan);
    return plan;
  },

  markDayCompleted(dayId) {
    const plan = Storage.getPlan();
    if (!plan) return;

    const day = plan.workoutDays.find(d => d.id === dayId);
    if (day) day.isCompleted = true;
    Storage.savePlan(plan);

    const today = this._todayStr();
    Storage.addCompletedDate(today);
  },

  getStreak() {
    const dates = Storage.getCompletedDates();
    if (!dates.length) return 0;

    const sorted = [...new Set(dates)].sort();
    const today = this._todayStr();
    const yesterday = this._offsetDay(-1);

    // Streak counts only if last workout was today or yesterday
    const lastDate = sorted[sorted.length - 1];
    if (lastDate !== today && lastDate !== yesterday) return 0;

    let streak = 0;
    let check = lastDate === today ? today : yesterday;

    while (sorted.includes(check)) {
      streak++;
      const d = new Date(check + 'T00:00:00');
      d.setDate(d.getDate() - 1);
      check = d.toISOString().slice(0, 10);
    }
    return streak;
  },

  _todayStr() {
    return new Date().toISOString().slice(0, 10);
  },

  _offsetDay(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  },

  // ---- Workout day CRUD ----

  addWorkoutDay(day) {
    const plan = Storage.getPlan();
    if (!plan) return;
    plan.workoutDays.push(day);
    Storage.savePlan(plan);
  },

  updateWorkoutDay(day) {
    const plan = Storage.getPlan();
    if (!plan) return;
    const idx = plan.workoutDays.findIndex(d => d.id === day.id);
    if (idx !== -1) plan.workoutDays[idx] = day;
    Storage.savePlan(plan);
  },

  removeWorkoutDay(dayId) {
    const plan = Storage.getPlan();
    if (!plan) return;
    plan.workoutDays = plan.workoutDays.filter(d => d.id !== dayId);
    Storage.savePlan(plan);
  },

  formatDuration(totalSeconds) {
    const m = Math.ceil(totalSeconds / 60);
    return `~${m} min`;
  },
};
