from flask import Blueprint, jsonify, request
from db import get_db


admin = Blueprint("admin", __name__)

# ---------------- PENDING FACULTY ----------------
@admin.route("/admin/pending-faculty")
def pending_faculty():
    db = get_db()
    rows = db.execute("""
        SELECT u.id, f.name, f.department, f.section, u.mobile
        FROM users u
        JOIN faculty f ON u.id = f.user_id
        WHERE u.role='faculty' AND u.approved=0
    """).fetchall()

    return jsonify([dict(r) for r in rows])

# ---------------- APPROVE FACULTY ----------------
@admin.route("/admin/approve/<int:user_id>", methods=["POST"])
def approve_faculty(user_id):
    db = get_db()
    db.execute("UPDATE users SET approved=1 WHERE id=?", (user_id,))
    db.commit()
    return jsonify(success=True)

# ---------------- REJECT FACULTY ----------------
@admin.route("/admin/reject/<int:user_id>", methods=["POST"])
def reject_faculty(user_id):
    db = get_db()
    db.execute("UPDATE users SET approved=-1 WHERE id=?", (user_id,))
    db.commit()
    return jsonify(success=True)

# ---------------- GET ALL STUDENTS (ADMIN VIEW) ----------------
@admin.route("/admin/students")
def get_students():
    db = get_db()
    rows = db.execute("""
        SELECT u.id AS student_id, s.fname, s.lname, u.mobile
        FROM users u
        JOIN students s ON u.id = s.user_id
    """).fetchall()

    return jsonify([dict(r) for r in rows])

# ---------------- ASSIGN STUDENT TO FACULTY ----------------
@admin.route("/admin/assign", methods=["POST"])
def assign_student():
    d = request.json or {}

    if not d.get("faculty_id") or not d.get("student_id"):
        return jsonify(success=False, message="Missing faculty or student id"), 400

    db = get_db()
    db.execute("""
        INSERT OR IGNORE INTO student_faculty (faculty_id, student_id)
        VALUES (?, ?)
    """, (d["faculty_id"], d["student_id"]))

    db.commit()
    return jsonify(success=True)

@admin.route("/admin/all-students")
def all_students():
    db = get_db()
    rows = db.execute("""
        SELECT 
            u.id,
            u.mobile,
            s.fname,
            s.lname,
            s.department,
            s.section,
            s.roll_number,
            s.batch
        FROM users u
        JOIN students s ON s.user_id = u.id
        WHERE u.role = 'student'
        ORDER BY s.department, s.section, s.roll_number
    """).fetchall()

    return jsonify([dict(r) for r in rows])

@admin.route("/admin/all-faculty")
def all_faculty():
    db = get_db()
    rows = db.execute("""
        SELECT 
            u.id,
            f.name,
            f.department,
            f.section,
            u.approved
        FROM users u
        JOIN faculty f ON f.user_id = u.id
        WHERE u.role = 'faculty'
        ORDER BY u.approved DESC
    """).fetchall()

    return jsonify([dict(r) for r in rows])

@admin.route("/admin/student/<int:user_id>", methods=["DELETE", "OPTIONS"])
def delete_student(user_id):
    if request.method == "OPTIONS":
        return "", 200

    db = get_db()
    db.execute("DELETE FROM students WHERE user_id=?", (user_id,))
    db.execute("DELETE FROM users WHERE id=?", (user_id,))
    db.commit()
    return jsonify(success=True)


@admin.route("/admin/faculty/<int:user_id>", methods=["DELETE", "OPTIONS"])
def delete_faculty(user_id):
    # 🔥 handle CORS preflight
    if request.method == "OPTIONS":
        return "", 200

    db = get_db()

    # delete faculty data first
    db.execute("DELETE FROM faculty WHERE user_id=?", (user_id,))
    # then delete user
    db.execute("DELETE FROM users WHERE id=?", (user_id,))

    db.commit()
    return jsonify(success=True)