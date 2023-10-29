export function generateRandomHex() {
  let result = "0x";
  let characters = "0123456789abcdef";
  for (let i = 0; i < 40; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
