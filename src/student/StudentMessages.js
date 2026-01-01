import { useEffect, useState } from "react";

function StudentMessages({ user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/messages/student/${user.id}`)
      .then(res => res.json())
      .then(setMessages)
      .catch(() => setMessages([]));
  }, [user.id]);

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📩 Messages</h3>
        <span className="text-sm text-gray-500">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </div>

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-2">📭</p>
          <p className="font-medium">No messages yet</p>
          <p className="text-sm">Messages from faculty will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 hover:shadow transition bg-gray-50"
            >
              {/* Title */}
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-blue-700">
                  {m.title || "Faculty Message"}
                </p>
                <span className="text-xs text-gray-400">
                  {m.created_at || ""}
                </span>
              </div>

              {/* Message Body */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentMessages;
