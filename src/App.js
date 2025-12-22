import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5000";
const input = "w-full border px-3 py-2 rounded mb-2";

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  // Profile popup
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Student popup
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({
    name: "",
    roll: "",
    dept: "",
  });

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------- AUTH ---------- */

  const signup = async () => {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!data.success) return alert(data.msg);
    alert("Signup successful");
    setIsLogin(true);
  };

  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: form.mobile,
        password: form.password,
      }),
    });
    const data = await res.json();
    if (!data.success) return alert("Invalid credentials");
    setUser(data.user);
  };

const logout = () => {
  setUser(null);
  setStudents([]);
  setForm({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    password: "",
  });
};


  /* ---------- LOAD STUDENTS ---------- */

  useEffect(() => {
    if (!user) return;
    fetch(`${API}/students/${user.mobile}`)
      .then((res) => res.json())
      .then(setStudents);
  }, [user]);

  /* ---------- STUDENT MODAL ---------- */

  const openAddStudent = () => {
    setStudentForm({ name: "", roll: "", dept: "" });
    setEditStudentId(null);
    setShowStudentModal(true);
  };

  const openEditStudent = (s) => {
    setStudentForm({ name: s.name, roll: s.roll, dept: s.dept });
    setEditStudentId(s.id);
    setShowStudentModal(true);
  };

  const saveStudent = async () => {
    if (!studentForm.name || !studentForm.roll) return;

    if (editStudentId) {
      await fetch(`${API}/students/${editStudentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm),
      });
    } else {
      await fetch(`${API}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...studentForm, mobile: user.mobile }),
      });
    }

    setShowStudentModal(false);

    fetch(`${API}/students/${user.mobile}`)
      .then((res) => res.json())
      .then(setStudents);
  };

  const deleteStudent = async (id) => {
    await fetch(`${API}/students/${id}`, { method: "DELETE" });
    setStudents(students.filter((s) => s.id !== id));
  };

  /* ---------- PROFILE ---------- */

  const saveProfile = async () => {
    const res = await fetch(`${API}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (data.success) {
      alert("Profile updated");
      setShowProfileModal(false);
    }
  };

  /* ---------- LOGIN / SIGNUP ---------- */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 w-full max-w-md shadow">
          <h2 className="text-2xl font-extrabold mb-6 text-center text-green-700">
              {isLogin ? "Student Login Portal" : "Create Student Account"}
          </h2>


          {!isLogin && (
            <>
              <input name="fname" placeholder="First Name" onChange={change} className={input} />
              <input name="lname" placeholder="Last Name" onChange={change} className={input} />
              <input name="email" placeholder="Email" onChange={change} className={input} />
            </>
          )}

          <input name="mobile" placeholder="Mobile" onChange={change} className={input} />
          <input name="password" type="password" placeholder="Password" onChange={change} className={input} />

          <button onClick={isLogin ? login : signup} className="w-full bg-blue-600 text-white py-2">
            {isLogin ? "Login" : "Signup"}
          </button>

          <p
            className="text-sm text-center text-blue-600 mt-3 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create account" : "Already have account?"}
          </p>
        </div>
      </div>
    );
  }

  /* ---------- DASHBOARD ---------- */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Bar */}
      <div className="bg-white p-4 flex justify-between shadow mb-4">
        <h2 className="font-bold">Student Dashboard</h2>
        <div className="space-x-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-gray-700 text-white px-3 py-1"
          >
            Profile
          </button>
          <button onClick={logout} className="text-red-600">
            Logout
          </button>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white p-4 shadow">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">Students</h3>
          <button onClick={openAddStudent} className="bg-blue-600 text-white px-3 py-1">
            Add Student
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Roll</th>
              <th className="border p-2">Dept</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="text-center">
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.roll}</td>
                <td className="border p-2">{s.dept}</td>
                <td className="border p-2">
                  <button onClick={() => openEditStudent(s)} className="text-blue-600 mr-3">
                    Edit
                  </button>
                  <button onClick={() => deleteStudent(s.id)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- STUDENT MODAL ---------- */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-md shadow">
            <h3 className="font-bold mb-3">
              {editStudentId ? "Edit Student" : "Add Student"}
            </h3>

            <input placeholder="Name" value={studentForm.name}
              onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
              className={input} />
            <input placeholder="Roll" value={studentForm.roll}
              onChange={(e) => setStudentForm({ ...studentForm, roll: e.target.value })}
              className={input} />
            <input placeholder="Department" value={studentForm.dept}
              onChange={(e) => setStudentForm({ ...studentForm, dept: e.target.value })}
              className={input} />

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowStudentModal(false)} className="border px-4 py-2">
                Cancel
              </button>
              <button onClick={saveStudent} className="bg-blue-600 text-white px-4 py-2">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- PROFILE MODAL ---------- */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-md shadow">
            <h3 className="font-bold mb-3">My Profile</h3>

            <input value={user.fname} onChange={(e) => setUser({ ...user, fname: e.target.value })} className={input} />
            <input value={user.lname} onChange={(e) => setUser({ ...user, lname: e.target.value })} className={input} />
            <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className={input} />

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowProfileModal(false)} className="border px-4 py-2">
                Cancel
              </button>
              <button onClick={saveProfile} className="bg-green-600 text-white px-4 py-2">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
