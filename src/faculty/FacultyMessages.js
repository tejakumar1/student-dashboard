import { useState } from "react";

function FacultyMessages({ user, students }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const send = async () => {
    await fetch("http://127.0.0.1:5000/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: user.id,
        student_ids: students.map(s => s.user_id),
        title,
        message,
      }),
    });
    setTitle(""); setMessage("");
    alert("Message sent");
  };

  return (
    <div className="bg-white p-4 shadow rounded mt-6">
      <h3 className="font-semibold mb-2">Send Message</h3>

      <input
        className="w-full border p-2 mb-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 mb-2"
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <button onClick={send}
        className="bg-green-600 text-white px-4 py-1 rounded">
        Send
      </button>
    </div>
  );
}

export default FacultyMessages;
