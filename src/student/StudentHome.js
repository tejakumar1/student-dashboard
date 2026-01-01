import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5000";

function StudentHome({ user, logout }) {
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [profileComplete, setProfileComplete] = useState(true);

  // form states
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [batch, setBatch] = useState("");

  /* 🔥 Load student profile */
  useEffect(() => {
    fetch(`${API}/student/profile/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);

        setFname(data.fname || "");
        setMname(data.mname || "");
        setLname(data.lname || "");
        setDepartment(data.department || "");
        setSection(data.section || "");
        setRollNumber(data.roll_number || "");
        setBatch(data.batch || "");

        if (!data.department || !data.section || !data.roll_number || !data.batch) {
          setProfileComplete(false);
        } else {
          setProfileComplete(true);
        }
      });
  }, [user.id]);

  /* 🔥 Load messages */
  useEffect(() => {
    fetch(`${API}/student/messages/${user.id}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [user.id]);

  /* ✅ Save profile */
  const saveProfile = async () => {
    if (!fname || !lname || !department || !section || !rollNumber || !batch) {
      alert("All fields are required");
      return;
    }

    await fetch(`${API}/student/update-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        fname,
        mname,
        lname,
        department,
        section,
        roll_number: rollNumber,
        batch,
      }),
    });

    setProfileComplete(true);
    window.location.reload();
  };

  if (!profile) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Welcome {profile.fname || "Student"} 👋
          </h2>
          <button onClick={logout} className="text-red-600 font-semibold">
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="mt-6 bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg mb-4">My Profile</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><b>Name:</b> {profile.fname} {profile.mname} {profile.lname}</p>
            <p><b>Mobile:</b> {profile.mobile}</p>
            <p><b>Department:</b> {profile.department || "Not set"}</p>
            <p><b>Section:</b> {profile.section || "Not set"}</p>
            <p><b>Roll No:</b> {profile.roll_number || "Not set"}</p>
            <p><b>Batch:</b> {profile.batch || "Not set"}</p>
          </div>
        </div>

        {/* Messages */}
<div className="mt-6 bg-white p-6 rounded-xl shadow">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold flex items-center gap-2">
      📩 Messages
    </h3>
    <span className="text-sm text-gray-500">
      {messages.length} {messages.length === 1 ? "message" : "messages"}
    </span>
  </div>

  {/* Empty State */}
  {messages.length === 0 ? (
    <div className="text-center py-10 text-gray-500">
      <div className="text-4xl mb-2">📭</div>
      <p className="font-medium">No messages yet</p>
      <p className="text-sm">Messages from faculty will appear here</p>
    </div>
  ) : (
    <div className="space-y-4">
      {messages.map((m, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow transition"
        >
          {/* Top row */}
          <div className="flex justify-between items-start mb-1">
            <p className="font-semibold text-blue-700">
              {m.faculty_name}
            </p>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {m.created_at}
            </span>
          </div>

          {/* Message body */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {m.message}
          </p>
        </div>
      ))}
    </div>
  )}
</div>


        {/* 🔐 PROFILE COMPLETION MODAL */}
        {!profileComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded shadow">
              <h3 className="font-bold text-lg text-center mb-4">
                Complete Your Profile
              </h3>

              <div className="space-y-2">
                <input className="w-full border px-3 py-2 rounded" placeholder="First Name" value={fname} onChange={e => setFname(e.target.value)} />
                <input className="w-full border px-3 py-2 rounded" placeholder="Middle Name" value={mname} onChange={e => setMname(e.target.value)} />
                <input className="w-full border px-3 py-2 rounded" placeholder="Last Name" value={lname} onChange={e => setLname(e.target.value)} />
                <input className="w-full border px-3 py-2 rounded" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
                <input className="w-full border px-3 py-2 rounded" placeholder="Section" value={section} onChange={e => setSection(e.target.value)} />
                <input className="w-full border px-3 py-2 rounded" placeholder="Roll Number" value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
                <input className="w-full border px-3 py-2 rounded" placeholder="Batch (2021–2025)" value={batch} onChange={e => setBatch(e.target.value)} />
              </div>

              <button
                onClick={saveProfile}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded font-semibold"
              >
                Save Profile
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StudentHome;
