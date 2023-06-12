"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import localforage from "localforage";
// import crypto from "crypto";

function generatePassword(
  masterPassword: string,
  fullName: string,
  keyword: string
): string {
  const seed = masterPassword + fullName + keyword;
  const upperAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerAlphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  const hash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const pickRandom = (str: string, seed: number): string => {
    return str[Math.floor(seededRandom(seed) * str.length)];
  };

  let password = "";
  const seedValue = hash(seed);

  for (let i = 0; i < 3; i++) {
    password += pickRandom(upperAlphabet, seedValue + i * 4);
    for (let j = 1; j <= 3; j++) {
      password += pickRandom(lowerAlphabet, seedValue + i * 4 + j);
    }
  }

  const randomGroupIndex = Math.floor(seededRandom(seedValue + 12) * 3);
  password =
    password.slice(0, randomGroupIndex * 4 + 4) +
    pickRandom(numbers, seedValue + 13) +
    pickRandom(specialChars, seedValue + 14) +
    password.slice(randomGroupIndex * 4 + 4);

  return password;
}

const PasswordsPage = () => {
  const router = useRouter();
  const { masterPassword, fullName } = router.query;

  const [keyword, setKeyword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwords, setPasswords] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadPasswords = async () => {
      const keys = await localforage.keys();
      const passwordData: { [key: string]: string } = {};

      for (const key of keys) {
        const password = await localforage.getItem<string>(key);
        if (password) {
          passwordData[key] = password;
        }
      }

      setPasswords(passwordData);
    };

    loadPasswords();
  }, []);

  const handleGeneratePassword = async () => {
    if (!masterPassword || !fullName) {
      alert("Master password and full name are required.");
      return;
    }

    const password = generatePassword(
      masterPassword as string,
      fullName as string,
      keyword
    );
    setGeneratedPassword(password);

    await localforage.setItem(keyword, password);
    setPasswords({ ...passwords, [keyword]: password });
  };

  const handleDeletePassword = async (key: string) => {
    await localforage.removeItem(key);

    const updatedPasswords = { ...passwords };
    delete updatedPasswords[key];
    setPasswords(updatedPasswords);
  };

  return (
    <div>
      <h1>Password Manager</h1>
      <div>
        <label>Keyword:</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <button onClick={handleGeneratePassword}>Generate Password</button>
      <div>
        <label>Generated Password:</label>
        <input type="text" value={generatedPassword} readOnly />
      </div>
      <h2>Saved Passwords</h2>
      <ul>
        {Object.entries(passwords).map(([key, password]) => (
          <li key={key}>
            {key}: {password}{" "}
            <button onClick={() => handleDeletePassword(key)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordsPage;
