from flask import Blueprint, jsonify, request
from db import get_db

faculty = Blueprint("faculty", __name__)

@faculty.route("/faculty/students/<int:faculty_user_id>")
def get_faculty_students(faculty_user_id):
    db = get_db()

    rows = db.execute("""
        SELECT s.user_id AS student_id,
               s.fname,
               s.lname,
               u.mobile
        FROM student_faculty sf
        JOIN students s ON sf.student_id = s.user_id
        JOIN users u ON u.id = s.user_id
        WHERE sf.faculty_id = ?
    """, (faculty_user_id,)).fetchall()

    return jsonify([dict(r) for r in rows])
@faculty.route("/faculty/profile/<int:user_id>")
def faculty_profile(user_id):
    db = get_db()
    row = db.execute("""
        SELECT 
            f.name,
            f.teacher_id,
            f.department,
            f.section,
            u.mobile
        FROM faculty f
        JOIN users u ON u.id = f.user_id
        WHERE f.user_id = ?
    """, (user_id,)).fetchone()

    if not row:
        return jsonify({}), 404

    return jsonify(dict(row))
@faculty.route("/faculty/refresh-students", methods=["POST"])
def refresh_students():
    d = request.json
    db = get_db()

    department = d.get("department")
    section = d.get("section")

    if not department or not section:
        return jsonify({"message": "Missing department or section"}), 400

    rows = db.execute("""
        SELECT 
            s.user_id,
            s.fname,
            s.lname,
            s.roll_number,
            s.batch,
            u.mobile
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE s.department = ?
          AND s.section = ?
    """, (department, section)).fetchall()

    return jsonify([dict(r) for r in rows])

@faculty.route("/faculty/message", methods=["POST"])
def send_message():
    db = get_db()
    d = request.json

    faculty_id = d.get("faculty_id")
    message = d.get("message")

    if not faculty_id or not message:
        return jsonify({"message": "Missing data"}), 400

    # find students assigned to this faculty (dept + section)
    students = db.execute("""
        SELECT s.user_id
        FROM students s
        JOIN faculty f ON f.user_id = ?
        WHERE s.department = f.department
          AND s.section = f.section
    """, (faculty_id,)).fetchall()

    for s in students:
        db.execute("""
            INSERT INTO messages (sender_id, receiver_id, message)
            VALUES (?, ?, ?)
        """, (faculty_id, s["user_id"], message))

    db.commit()
    return jsonify(success=True)
