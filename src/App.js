import { useEffect, useState } from "react";

import Login from "./auth/Login";
import Signup from "./auth/Signup";

import StudentHome from "./student/StudentHome";
import FacultyHome from "./faculty/FacultyHome";
import AdminHome from "./admin/AdminHome";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  /* ---------------- RESTORE SESSION ---------------- */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.role) {
        setUser(parsed);
      }
    }
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async (mobile, password) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid id or password");
        return;
      }

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /* ---------------- AUTH PAGES ---------------- */
  if (!user) {
    return showSignup ? (
      <Signup onBack={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={login}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

  /* ---------------- ROLE BASED ROUTING ---------------- */

  // STUDENT
  if (user.role === "student") {
    return <StudentHome user={user} logout={logout} />;
  }

  // FACULTY
  if (user.role === "faculty") {
    return <FacultyHome user={user} logout={logout} />;
  }

  // ADMIN
  if (user.role === "admin") {
    return <AdminHome logout={logout} />;
  }

  /* ---------------- FALLBACK ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-red-600 text-xl font-bold">
        Invalid role
      </h2>
    </div>
  );
}

export default App;
