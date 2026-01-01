import { useState } from "react";

function Signup({ onBack }) {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const signup = async () => {
    console.log("Signup payload:", { role, ...form }); // 🔥 DEBUG

    const res = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, ...form }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Signup failed");

    alert("Signup successful");
    onBack();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow rounded w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Signup</h2>

        <select
          className="w-full border p-2 mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>

        {/* ALWAYS REQUIRED */}
        <input
          name="mobile"
          placeholder="Mobile"
          className="w-full border p-2 mb-2"
          onChange={change}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2"
          onChange={change}
        />

        {/* STUDENT FIELDS */}
        {role === "student" && (
          <>
            <input name="fname" placeholder="First Name" className="w-full border p-2 mb-2" onChange={change} />
            <input name="mname" placeholder="Middle Name" className="w-full border p-2 mb-2" onChange={change} />
            <input name="lname" placeholder="Last Name" className="w-full border p-2 mb-2" onChange={change} />
          </>
        )}

        {/* FACULTY FIELDS */}
        {role === "faculty" && (
          <>
            <input name="name" placeholder="Faculty Name" className="w-full border p-2 mb-2" onChange={change} />
            <input name="teacher_id" placeholder="Teacher ID" className="w-full border p-2 mb-2" onChange={change} />
            <input name="department" placeholder="Department" className="w-full border p-2 mb-2" onChange={change} />
            <input name="section" placeholder="Section" className="w-full border p-2 mb-2" onChange={change} />
          </>
        )}

        <button
          onClick={signup}
          className="w-full bg-green-600 text-white py-2 mt-2"
        >
          Signup
        </button>

        <p
          className="text-center text-blue-600 mt-3 cursor-pointer"
          onClick={onBack}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default Signup;
