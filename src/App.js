

import { useEffect, useState, useCallback } from "react";

const API = "http://127.0.0.1:5000";
const input = "w-full border px-3 py-2 rounded mb-2";

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const [form, setForm] = useState({
    fname: "", lname: "", email: "", mobile: "", password: "",
  });

  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({
    name: "", roll: "", dept: "", age: "",
  });
  const [errors, setErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);


  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- VALIDATION ---------------- */

  const isEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isMobile = (mobile) =>
    /^[6-9]\d{9}$/.test(mobile);

  const validateLogin = (form) => {
    if (!form.mobile.trim()) return "Mobile is required";
    if (!form.password.trim()) return "Password is required";
    return null;
  };

const validateSignup = (form) => {
  const err = {};

  if (!form.fname.trim()) err.fname = "First name is required";
  if (!form.lname.trim()) err.lname = "Last name is required";

  if (!form.email.trim())
    err.email = "Email is required";
  else if (!isEmail(form.email))
    err.email = "Invalid email address";

  if (!form.mobile.trim())
    err.mobile = "Mobile is required";
  else if (!isMobile(form.mobile))
    err.mobile = "Invalid mobile number";

  if (!form.password)
    err.password = "Password is required";
  else if (form.password.length < 6)
    err.password = "Minimum 6 characters";

  return err;
};


  /* ---------------- FETCH STUDENTS (FIXED POSITION) ---------------- */

  const fetchStudents = useCallback(async () => {
    if (!user) return;

    const params = new URLSearchParams();
    if (filterName.trim()) params.append("name", filterName);
    if (filterAge) params.append("age", filterAge);

    const res = await fetch(`${API}/students?${params.toString()}`);
    const data = await res.json();
    setStudents(data);
  }, [user, filterName, filterAge]);

  /* load students after login & filter */
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /* ---------------- AUTH ---------------- */

const signup = async () => {
  const validationErrors = validateSignup(form);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) return;

  const res = await fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    setErrors({ server: data.message || data.msg || "Signup failed" });
    return;
  }

  setErrors({});
  setIsLogin(true);
  return alert("successful signup 😍");
};



  const login = async () => {
    const error = validateLogin(form);
    if (error) return alert(error);

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: form.mobile,
        password: form.password,
        
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success)
      return alert(data.message || "Invalid credentials");

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return alert("successful Login 🥳");
  };

  const logout = () => {
    setUser(null);
    setStudents([]);
    localStorage.removeItem("user");
    setForm({ fname: "", lname: "", email: "", mobile: "", password: "" });
  };

  /* ---------------- STUDENTS ---------------- */

  const openAddStudent = () => {
    setStudentForm({ name: "", roll: "", dept: "", age: "" });
    setEditStudentId(null);
    setShowStudentModal(true);
  };

  const openEditStudent = (s) => {
    setStudentForm({ name: s.name, roll: s.roll, dept: s.dept, age: s.age });
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
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await fetch(`${API}/students/${id}`, { method: "DELETE" });
    setStudents(students.filter((s) => s.id !== id));
  };

  const clearFilters = async () => {
    setFilterName("");
    setFilterAge("");

    const res = await fetch(`${API}/students`);
    const data = await res.json();
    setStudents(data);
  };

  /* ---------------- PROFILE ---------------- */const saveProfile = async () => {
  setProfileLoading(true); // 🔥 START BUFFER

  try {
    const formData = new FormData();
    formData.append("fname", user.fname);
    formData.append("lname", user.lname);
    formData.append("email", user.email);
    formData.append("mobile", user.mobile);

    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }

    const res = await fetch(`${API}/profile`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert("Profile update failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    // ⛔ DO NOT close modal immediately
    setTimeout(() => {
      setShowProfileModal(false);
    }, 500);
  } catch (err) {
    alert("Network error");
  } finally {
    setProfileLoading(false); // ✅ STOP BUFFER
  }
};


  /* ---------------- LOGIN UI ---------------- */
if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 w-full max-w-md shadow">
        <h2 className="text-lg font-bold mb-4 text-center">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {!isLogin && (
          <>
            <input
              name="fname"
              placeholder="First Name"
              onChange={change}
              className={input}
            />
            {errors.fname && (
              <p className="text-red-500 text-sm mb-1">{errors.fname}</p>
            )}

            <input
              name="lname"
              placeholder="Last Name"
              onChange={change}
              className={input}
            />
            {errors.lname && (
              <p className="text-red-500 text-sm mb-1">{errors.lname}</p>
            )}

            <input
              name="email"
              placeholder="Email"
              onChange={change}
              className={input}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-1">{errors.email}</p>
            )}
          </>
        )}

        <input
          name="mobile"
          placeholder="Mobile"
          onChange={change}
          className={input}
        />
        {errors.mobile && (
          <p className="text-red-500 text-sm mb-1">{errors.mobile}</p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={change}
          className={input}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-1">{errors.password}</p>
        )}

        {errors.server && (
          <p className="text-red-600 text-sm text-center mb-2">
            {errors.server}
          </p>
        )}

        <button
          onClick={isLogin ? login : signup}
          className="w-full bg-blue-600 text-white py-2"
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          className="text-sm text-center text-blue-600 mt-3 cursor-pointer"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrors({});
          }}
        >
          {isLogin ? "Create account" : "Already have account?"}
        </p>
      </div>
    </div>
  );
}


  /* dashboard UI */
return (
  <div className="min-h-screen bg-gray-100 flex justify-center">
  <div className="w-full max-w-7xl px-4 py-4">

    {/* Header */}
    <div className="bg-white p-3 flex items-center justify-between shadow mb-3">
      <h2 className="w-full text-center text-xl font-semibold text-gray-800 bg-white py-2 rounded shadow-sm">Student Dashboard</h2>
      <div className="flex gap-2">
        <button onClick={() => setShowProfileModal(true)}
          className="bg-gray-700 text-white px-3 py-1 rounded">Profile</button>
        <button onClick={logout} className="text-red-600">Logout</button>
      </div>
    </div>

    {/* Content */}
    <div className="bg-white p-4 shadow rounded">

      {/* Title + Add */}


      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <input type="text" placeholder="Name"
          className="border px-2 py-1 rounded"
          value={filterName} onChange={(e) => setFilterName(e.target.value)} />
        <input type="number" placeholder="Age"
          className="border px-2 py-1 rounded w-24"
          value={filterAge} onChange={(e) => setFilterAge(e.target.value)} />
        
        <button onClick={fetchStudents}
          className="bg-blue-600 text-white px-3 py-1 rounded">Filter</button>
        <button onClick={clearFilters}
          className="bg-red-500 text-white px-3 py-1 rounded">Clear</button>
        
          <button onClick={openAddStudent}
          className="bg-green-600 text-white px-3 py-1 rounded mr-3 ml-auto">
          Add Student
        </button>
      </div>
      

      {/* Table */}
      <h3 className="font-semibold">Students</h3>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Roll</th>
              <th className="border p-2">Dept</th>
              <th className="border p-2">Age</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="text-center">
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.roll}</td>
                <td className="border p-2">{s.dept}</td>
                <td className="border p-2">{s.age}</td>
                <td className="border p-2">
                  <button onClick={() => openEditStudent(s)}
                    className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => deleteStudent(s.id)}
                    className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>

    {/* Student Modal */}
    {showStudentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-4 w-full max-w-md shadow rounded">
          <h3 className="font-bold mb-2">
            {editStudentId ? "Edit Student" : "Add Student"}
          </h3>
          <input className={input} placeholder="name"
            value={studentForm.name}
            onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
          <input className={input} placeholder="roll"
            value={studentForm.roll}
            onChange={(e) => setStudentForm({ ...studentForm, roll: e.target.value })} />
          <input className={input} placeholder="dept"
            value={studentForm.dept}
            onChange={(e) => setStudentForm({ ...studentForm, dept: e.target.value })} />
          <input className={input} placeholder="age"
            value={studentForm.age}
            onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })} />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowStudentModal(false)}
              className="border px-3 py-1">Cancel</button>
            <button onClick={saveStudent}
              className="bg-green-600 text-white px-3 py-1">Save</button>

          </div>
        </div>
      </div>
    )}

    {/* Profile Modal */}
    {showProfileModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-4 w-full max-w-md shadow rounded">
          <h3 className="font-bold mb-2 text-center">My Profile</h3>

          <img
            src={user?.profile_pic ? `${API}/uploads/${user.profile_pic}` : "/default-avatar.png"}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
            alt="profile"
          />

          <input className={input} placeholder="Fname"
            value={user.fname} onChange={(e) => setUser({ ...user, fname: e.target.value })} />
          <input className={input} placeholder="Lname"
            value={user.lname} onChange={(e) => setUser({ ...user, lname: e.target.value })} />
          <input className={input} placeholder="Email"
            value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
          <input type="file" accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])} />

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setShowProfileModal(false)}
              className="border px-3 py-1">Cancel</button>
            <button onClick={saveProfile} disabled={profileLoading} className={`px-3 py-1 rounded text-white flex items-center justify-center ${profileLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}>
               {profileLoading ? (
               <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                     Uploading...
               </>
             ) : (
             "Save"
            )}</button>

          </div>
        </div>
      </div>
    )}

  </div>
  </div>
);

}

export default App;