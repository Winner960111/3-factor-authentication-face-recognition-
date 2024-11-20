export {}; // This ensures the file is treated as a module

declare global {
  interface Window {
    recaptchaVerifier: import('firebase/auth').RecaptchaVerifier;
  }
}