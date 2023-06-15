"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import "./globals.css";

const IndexPage = () => {
  const [masterPassword, setMasterPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    router.push({
      pathname: "/passwords",
      query: { masterPassword, fullName },
    });
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="bg-gray-700 rounded-lg shadow-lg px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">
          Password Manager
        </h2>
        <div className="mb-8">
          <label className="block text-gray-100 font-semibold mb-2">
            Master Password:
          </label>
          <input
            className="block w-full bg-gray-900 rounded-md px-4 py-2 text-gray-100 border-none focus:ring focus:ring-blue-500 focus:outline-none"
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-100 font-semibold mb-2">
            Full Name:
          </label>
          <input
            className="block w-full bg-gray-900 rounded-md px-4 py-2 text-gray-100 border-none focus:ring focus:ring-blue-500 focus:outline-none"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <button
          className="bg-indigo-600 text-white rounded-md px-6 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:outline focus-visible:outline-indigo-800 transition-colors duration-200"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
