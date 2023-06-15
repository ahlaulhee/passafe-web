"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import localforage from "localforage";
import "./globals.css";
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
    <div className="bg-gray-800 h-screen flex flex-col p-5">
      <h2 className="text-xl font-semibold text-gray-100 mb-6">
        Password Manager
      </h2>
      <div className="bg-gray-700 rounded-lg shadow-lg px-6 py-8 mb-8">
        <div className="mb-8">
          <label className="block text-gray-100 font-semibold mb-2">
            Keyword:
          </label>
          <input
            className="block w-full bg-gray-900 rounded-md px-4 py-2 text-gray-100 border-none focus:ring focus:ring-blue-500 focus:outline-none"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        {generatedPassword && (
          <div className="mb-8">
            <label className="block text-gray-100 font-semibold mb-2">
              Generated Password:
            </label>
            <span className="block w-full rounded-md border border-gray-600 px-4 py-2 text-gray-100 bg-gray-900 mb-4">
              {generatedPassword}
            </span>
          </div>
        )}
        <button
          className="bg-indigo-600 text-white rounded-md px-6 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:outline focus-visible:outline-indigo-800 transition-colors duration-200 mr-4"
          onClick={handleGeneratePassword}
        >
          Generate Password
        </button>
      </div>
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 flex-1">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">
          Password List
        </h2>
        <ul id="password-list" className="list-disc pl-4 text-gray-100">
          {Object.entries(passwords).map(([key, password]) => (
            <li className="flex justify-between items-center mb-2" key={key}>
              <p className="mr-4">
                <strong>Keyword:</strong>
                {key}
              </p>
              <p>
                <strong>Password:</strong>
                {password}
              </p>
              <button
                className="bg-red-500 text-white rounded-full px-3 py-1 hover:bg-red-400 focus:outline-none focus-visible:outline focus-visible:outline-red-800 transition-colors duration-200"
                onClick={() => handleDeletePassword(key)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordsPage;
