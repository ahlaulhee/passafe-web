"use client";
import { useState } from "react";
import { useRouter } from "next/router";

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
    <div>
      <h1>Password Manager</h1>
      <div>
        <label>Master Password:</label>
        <input
          type="password"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default IndexPage;
