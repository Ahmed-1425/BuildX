// Generates a non-sequential, random reference code: BX-2026-XXXXXX
export function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // removed O,0,I,1 for readability
  let code = "";
  const array = new Uint8Array(6);
  // Node.js crypto (server-side only)
  const crypto = require("crypto") as typeof import("crypto");
  crypto.getRandomValues
    ? crypto.getRandomValues(array)
    : array.set(crypto.randomBytes(6));
  for (let i = 0; i < 6; i++) {
    code += chars[array[i] % chars.length];
  }
  return `BX-${year}-${code}`;
}
