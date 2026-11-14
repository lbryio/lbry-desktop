// Rules for the create and import forms. The main process enforces the same minimum, so this is only for
// showing the reason before anything is sent.
export const MIN_PASSWORD_LENGTH = 8;

export function validatePasswords(password: string, confirm: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `The password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password !== confirm) return "The two passwords do not match.";
  return null;
}
