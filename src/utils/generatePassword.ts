import { createHash } from "crypto";

export default function generateSafePassword(
  keyword: string,
  masterPassword: string
): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()[]";

  const hash = createHash("sha256");
  hash.update(keyword + masterPassword);
  const hashed = hash.digest("hex");

  let password = "";
  for (let i = 0; i < 12; i += 4) {
    const index1 = parseInt(hashed[i], 16) % alphabet.length;
    const index2 = parseInt(hashed[i + 1], 16) % alphabet.length;
    const index3 = parseInt(hashed[i + 2], 16) % alphabet.length;
    const index4 = parseInt(hashed[i + 3], 16) % numbers.length;
    const index5 = parseInt(hashed[i + 4], 16) % symbols.length;

    password +=
      alphabet[index1] +
      alphabet[index2] +
      alphabet[index3] +
      numbers[index4] +
      symbols[index5];
  }

  return password.slice(0, 12);
}

// Example usage:

// const keyword = "example";
// const masterPassword = "secure123";
// const safePassword = generateSafePassword(keyword, masterPassword);
// console.log(safePassword);
