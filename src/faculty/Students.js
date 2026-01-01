function Students({ students, onRemove }) {
  return (
    <div className="mt-6 bg-white p-4 shadow rounded">
      <h3 className="font-semibold mb-3">My Students</h3>

      {students.length === 0 ? (
        <p className="text-gray-500">No students assigned</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Roll</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="text-center">
                <td className="border p-2">{s.roll}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">
                  <button
                    onClick={() => onRemove(s.id)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
