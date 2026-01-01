import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5000";

function AdminHome({ logout }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingFaculty, setPendingFaculty] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);
  const [students, setStudents] = useState([]);

  /* ================= LOADERS ================= */

  const loadPendingFaculty = async () => {
    try {
      const res = await fetch(`${API}/admin/pending-faculty`);
      setPendingFaculty(await res.json());
    } catch (err) {
      console.error("Pending faculty load failed", err);
    }
  };

  const loadAllFaculty = async () => {
    try {
      const res = await fetch(`${API}/admin/all-faculty`);
      setAllFaculty(await res.json());
    } catch (err) {
      console.error("All faculty load failed", err);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await fetch(`${API}/admin/all-students`);
      setStudents(await res.json());
    } catch (err) {
      console.error("Students load failed", err);
    }
  };

  /* ================= ACTIONS ================= */

  const approve = async (id) => {
    await fetch(`${API}/admin/approve/${id}`, { method: "POST" });
    loadPendingFaculty();
    loadAllFaculty();
  };

  const reject = async (id) => {
    await fetch(`${API}/admin/reject/${id}`, { method: "POST" });
    loadPendingFaculty();
    loadAllFaculty();
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm("Delete this faculty permanently?")) return;
    await fetch(`${API}/admin/faculty/${id}`, { method: "DELETE" });
    loadAllFaculty();
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student permanently?")) return;
    await fetch(`${API}/admin/student/${id}`, { method: "DELETE" });
    loadStudents();
  };

  /* ================= INIT ================= */

  useEffect(() => {
    loadPendingFaculty();
    loadAllFaculty();
    loadStudents();
  }, []);

  /* ================= UI ================= */

  const statusBadge = (status) => {
    if (status === 1) return <span className="text-green-600 font-semibold">Approved</span>;
    if (status === 0) return <span className="text-yellow-600 font-semibold">Pending</span>;
    return <span className="text-red-600 font-semibold">Rejected</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="bg-white p-4 rounded shadow flex justify-between items-center">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="text-red-600 font-semibold">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-4">
        {[
          { key: "pending", label: "Pending Faculty" },
          { key: "faculty", label: "All Faculty" },
          { key: "students", label: "All Students" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white shadow"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= PENDING FACULTY ================= */}
      {activeTab === "pending" && (
        <div className="mt-6 bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">Pending Faculty Approvals</h3>

          {pendingFaculty.length === 0 ? (
            <p className="text-gray-500">No pending approvals</p>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Section</th>
                  <th>Mobile</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingFaculty.map(f => (
                  <tr key={f.id} className="text-center border">
                    <td>{f.name}</td>
                    <td>{f.department}</td>
                    <td>{f.section}</td>
                    <td>{f.mobile}</td>
                    <td className="space-x-2">
                      <button onClick={() => approve(f.id)} className="bg-green-600 text-white px-3 py-1 rounded">
                        Approve
                      </button>
                      <button onClick={() => reject(f.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ================= ALL FACULTY ================= */}
      {activeTab === "faculty" && (
        <div className="mt-6 bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">Faculty Approval History</h3>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Section</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allFaculty.map(f => (
                <tr key={f.id} className="text-center border">
                  <td>{f.name}</td>
                  <td>{f.department}</td>
                  <td>{f.section}</td>
                  <td>{statusBadge(f.approved)}</td>
                  <td>
                    <button onClick={() => deleteFaculty(f.id)} className="text-red-600 font-semibold">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ALL STUDENTS ================= */}
      {activeTab === "students" && (
        <div className="mt-6 bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">All Students</h3>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Department</th>
                <th>Section</th>
                <th>Roll</th>
                <th>Batch</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="text-center border">
                  <td>{s.fname} {s.lname}</td>
                  <td>{s.mobile}</td>
                  <td>{s.department}</td>
                  <td>{s.section}</td>
                  <td>{s.roll_number}</td>
                  <td>{s.batch}</td>
                  <td>
                    <button onClick={() => deleteStudent(s.id)} className="text-red-600 font-semibold">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default AdminHome;
