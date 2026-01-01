import { useState } from "react";

function Login({ onLogin, onSignup }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow rounded w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">Login</h2>

        <input
          placeholder="Mobile Number"
          className="w-full border p-2 mb-3"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => onLogin(mobile, password)}
          className="w-full bg-blue-600 text-white py-2"
        >
          Login
        </button>

        <p
          onClick={onSignup}
          className="text-center text-blue-600 mt-3 cursor-pointer"
        >
          Create new account
        </p>
      </div>
    </div>
  );
}

export default Login;
