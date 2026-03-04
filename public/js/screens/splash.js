// ============================================================
//  Splash Screen
// ============================================================

const SplashScreen = {
  init() {
    setTimeout(() => {
      if (Storage.isOnboardingDone()) {
        App.show('dashboard');
      } else {
        App.show('intro');
      }
    }, 2500);
  },
};
