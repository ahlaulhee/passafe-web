"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMasterPassword,
  addPassword,
} from "../redux/reducers/passwordReducer";
import generateSafePassword from "../utils/generatePassword";

export default function Home() {
  const dispatch = useDispatch();
  const masterPassword = useSelector(
    (state: any) => state.passwords.masterPassword
  );
  const passwords = useSelector((state: any) => state.passwords.passwords);

  const [inputMasterPassword, setInputMasterPassword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");

  const handleSetMasterPassword = () => {
    dispatch(setMasterPassword(inputMasterPassword));
  };

  const handleAddPassword = () => {
    const generatedPassword = generateSafePassword(
      inputKeyword,
      masterPassword!
    );
    dispatch(
      addPassword({ keyword: inputKeyword, password: generatedPassword })
    );
  };
  console.log(window.localStorage);
  console.log(window.sessionStorage);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {/* Render the master password input and button */}
        <input
          type="password"
          value={inputMasterPassword}
          onChange={(e) => setInputMasterPassword(e.target.value)}
        />
        <button onClick={handleSetMasterPassword}>Set Master Password</button>

        {/* Render the keyword input and button */}
        <input
          type="text"
          value={inputKeyword}
          onChange={(e) => setInputKeyword(e.target.value)}
        />
        <button onClick={handleAddPassword}>Add Password</button>

        {/* Render the list of passwords */}
        <ul>
          {passwords.map(
            (item: { keyword: string; password: string }, index: number) => (
              <li key={index}>
                {item.keyword}: {masterPassword ? item.password : "****"}
              </li>
            )
          )}
        </ul>
      </div>
    </main>
  );
}
