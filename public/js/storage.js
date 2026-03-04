// ============================================================
//  FITHUB - localStorage wrapper
// ============================================================

const Storage = {
  KEYS: {
    ONBOARDING: 'fithub_onboarding_complete',
    PROFILE:    'fithub_profile',
    PLAN:       'fithub_plan',
    DATES:      'fithub_completed_dates',
    PHOTO:      'fithub_photo',
  },

  get(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  isOnboardingDone() {
    return this.get(this.KEYS.ONBOARDING) === true;
  },

  completeOnboarding() {
    this.set(this.KEYS.ONBOARDING, true);
  },

  saveProfile(profile) {
    this.set(this.KEYS.PROFILE, profile);
  },

  getProfile() {
    return this.get(this.KEYS.PROFILE);
  },

  // Foto armazenada separadamente (pode ser grande em base64)
  savePhoto(base64) {
    try {
      localStorage.setItem(this.KEYS.PHOTO, base64);
    } catch (e) {
      console.warn('[Storage] Foto grande demais para localStorage:', e);
    }
  },

  getPhoto() {
    return localStorage.getItem(this.KEYS.PHOTO) || null;
  },

  removePhoto() {
    localStorage.removeItem(this.KEYS.PHOTO);
  },

  savePlan(plan) {
    this.set(this.KEYS.PLAN, plan);
  },

  getPlan() {
    return this.get(this.KEYS.PLAN);
  },

  getCompletedDates() {
    return this.get(this.KEYS.DATES) || [];
  },

  addCompletedDate(dateStr) {
    const dates = this.getCompletedDates();
    if (!dates.includes(dateStr)) dates.push(dateStr);
    this.set(this.KEYS.DATES, dates);
  },

  clearAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
  },
};
