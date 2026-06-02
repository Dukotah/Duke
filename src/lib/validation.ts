// Basic shape check to avoid sending to obviously malformed addresses.
// Hard bounces are one of the strongest signals that flags a sender as spam,
// so every send path should run an address through this first.
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
