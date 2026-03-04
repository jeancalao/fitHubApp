// ============================================================
//  Plan Generation Screen
// ============================================================

const PlanGenerationScreen = {
  init({ profile }) {
    const loading = document.getElementById('plan-gen-loading');
    const result  = document.getElementById('plan-gen-result');

    loading.classList.remove('hidden');
    result.classList.add('hidden');

    setTimeout(() => {
      // Save and generate
      Storage.saveProfile(profile);
      const plan = Workout.generatePlan(profile);
      Storage.completeOnboarding();

      // Populate summary card
      const card = document.getElementById('plan-summary-card');
      const secPerEx = plan.workoutDays[0].exercises[0].durationSeconds;
      card.innerHTML = `
        <p><i class="fas fa-bullseye"></i> <strong>Meta:</strong> ${profile.objectiveLabel}</p>
        <p><i class="fas fa-clock"></i> <strong>${profile.availableTimeMinutes} min</strong> / treino, 3x na semana</p>
        <p><i class="fas fa-dumbbell"></i> Exercícios: ${secPerEx}s cada, baseado no peso do corpo${profile.equipment.includes('elastico') ? ' + elástico' : ''}</p>
        <p><i class="fas fa-layer-group"></i> Nível: ${profile.levelLabel}</p>
      `;

      // Swap views
      loading.classList.add('hidden');
      result.classList.remove('hidden');

      // Wire button (clone to avoid duplicate listeners)
      const btn = document.getElementById('btn-go-dashboard');
      const clone = btn.cloneNode(true);
      btn.replaceWith(clone);
      clone.addEventListener('click', () => App.show('dashboard'));
    }, 3000);
  },
};
