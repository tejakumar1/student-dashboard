from flask import Blueprint, request, jsonify
from db import get_db

messages = Blueprint("messages", __name__)

@messages.route("/messages/send", methods=["POST"])
def send():
    d = request.json
    db = get_db()
    for sid in d["student_ids"]:
        db.execute(
            "INSERT INTO messages (sender_id,receiver_id,title,message) VALUES (?,?,?,?)",
            (d["sender_id"], sid, d["title"], d["message"])
        )
    db.commit()
    return jsonify(success=True)

@messages.route("/messages/student/<int:sid>")
def inbox(sid):
    db = get_db()
    rows = db.execute(
        "SELECT title,message FROM messages WHERE receiver_id=?", (sid,)
    ).fetchall()
    return jsonify([dict(r) for r in rows])
