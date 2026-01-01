import { useEffect, useState } from "react";


const API = "http://127.0.0.1:5000";

function FacultyHome({ user, logout }) {
  const [showProfile, setShowProfile] = useState(false);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);


  // 🔥 Load REAL students assigned to this faculty
 useEffect(() => {
  fetch(`${API}/faculty/profile/${user.id}`)
    .then(res => res.json())
    .then(data => setProfile(data))
    .catch(() => setProfile(null));
}, [user.id]);


  /* ⏳ Pending Approval */
  if (user.role === "faculty" && user.approved === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 shadow rounded text-center">
          <h2 className="text-xl font-bold mb-2">Approval Pending ⏳</h2>
          <p className="text-gray-600">
            Your account is under verification by Admin.
          </p>
          <button onClick={logout} className="mt-4 text-red-600">
            Logout
          </button>
        </div>
      </div>
    );
  }

  /* ❌ Rejected */
  if (user.role === "faculty" && user.approved === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 shadow rounded text-center">
          <h2 className="text-xl font-bold mb-2 text-red-600">
            Application Rejected ❌
          </h2>
          <p className="text-gray-600">
            Your faculty registration was rejected by Admin.
          </p>
          <button onClick={logout} className="mt-4 text-red-600">
            Logout
          </button>
        </div>
      </div>
    );
  }

const refreshStudents = async () => {
  const res = await fetch(`${API}/faculty/refresh-students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      department: profile.department,
      section: profile.section,
    }),
  });

  const data = await res.json();
  setStudents(data);
};


  // ✅ Send message to assigned students
  const sendMessage = async () => {
    if (!message.trim()) return;

    await fetch(`${API}/faculty/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        faculty_id: user.id,
        message
      }),
    });

    setMessage("");
    alert("Message sent");
  };
  if (!profile) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Loading profile...</p>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="bg-white p-4 shadow rounded flex justify-between items-center">
        <h2 className="text-xl font-bold">Faculty Portal</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowProfile(true)}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Profile
          </button>
          <button onClick={logout} className="text-red-600">
            Logout
          </button>
        </div>
      </div>
      <button
  onClick={refreshStudents}
  className="bg-green-600 text-white px-4 py-1 rounded"
>
  Refresh Students 🔄
</button>


      {/* Faculty Info */}
      <div className="mt-6 bg-white p-4 shadow rounded grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><p className="font-semibold">Name</p><p>{profile.name}</p></div>
        <div><p className="font-semibold">Department</p><p>{profile.department}</p></div>
        <div><p className="font-semibold">Section</p><p>{profile.section}</p></div>
      </div>

      {/* Students Table */}
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-3">My Students</h3>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">roll_number</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No students assigned yet
                </td>
              </tr>
            ) : (
              students.map((s, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{s.fname} {s.lname}</td>
                  <td className="border p-2">{s.mobile}</td>
                  <td className="border p-2">{s.roll_number}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Message Box */}
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">Send Message</h3>
        <textarea
          className="w-full border p-2 rounded mb-2"
          placeholder="Type message to students..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded w-full max-w-md shadow">
            <h3 className="font-bold text-center mb-3">My Profile</h3>
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Mobile:</b> {profile.mobile}</p>
            <p><b>Teacher ID:</b> {profile.teacher_id}</p>
            <p><b>Department:</b> {profile.department}</p>
            <p><b>Section:</b> {profile.section}</p>
            <div className="text-right mt-4">
              <button
                onClick={() => setShowProfile(false)}
                className="bg-gray-700 text-white px-4 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FacultyHome;
