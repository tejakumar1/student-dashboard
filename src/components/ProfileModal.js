function ProfileModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-5 rounded shadow w-full max-w-md">
        <h3 className="font-bold mb-3 text-center">Profile</h3>

        {Object.keys(user).map(k => (
          <p key={k}><b>{k}:</b> {String(user[k])}</p>
        ))}

        <div className="text-right mt-4">
          <button onClick={onClose}
            className="bg-gray-700 text-white px-4 py-1 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
