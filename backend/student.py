from flask import Blueprint, jsonify , request
from db import get_db

student = Blueprint("student", __name__)

@student.route("/student/profile/<int:user_id>")
def student_profile(user_id):
    db = get_db()
    row = db.execute("""
        SELECT 
            fname, mname, lname,
            department, section, roll_number, batch,
            mobile
        FROM students
        JOIN users ON users.id = students.user_id
        WHERE user_id=?
    """, (user_id,)).fetchone()

    return jsonify(dict(row))



@student.route("/student/messages/<int:user_id>")
def student_messages(user_id):
    db = get_db()
    rows = db.execute("""
        SELECT 
            m.message,
            m.created_at,
            f.name AS faculty_name
        FROM messages m
        JOIN faculty f ON m.sender_id = f.user_id
        WHERE m.receiver_id = ?
        ORDER BY m.created_at DESC
    """, (user_id,)).fetchall()

    return jsonify([dict(r) for r in rows])


@student.route("/student/update-profile", methods=["PUT"])
def update_profile():
    d = request.json
    db = get_db()

    # 1️⃣ Update student profile
    db.execute("""
    UPDATE students
    SET fname=?, mname=?, lname=?,
        department=?, section=?, roll_number=?, batch=?
    WHERE user_id=?
    """, (
    d["fname"],
    d.get("mname"),
    d["lname"],
    d["department"],
    d["section"],
    d["roll_number"],
    d["batch"],
    d["user_id"]
))


    # 2️⃣ Find approved faculty of same section
    faculty = db.execute("""
        SELECT u.id AS faculty_id
        FROM users u
        JOIN faculty f ON u.id = f.user_id
        WHERE u.role='faculty'
          AND u.approved=1
          AND f.section=?
    """, (d["section"],)).fetchone()

    # 3️⃣ Auto assign if faculty exists
    if faculty:
        db.execute("""
            INSERT OR IGNORE INTO student_faculty (faculty_id, student_id)
            VALUES (?, ?)
        """, (faculty["faculty_id"], d["user_id"]))

    db.commit()
    return jsonify(success=True)