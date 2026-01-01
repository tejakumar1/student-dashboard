from flask import Blueprint, request, jsonify
from db import get_db

auth = Blueprint("auth", __name__)

# ---------------- SIGNUP ----------------
@auth.route("/signup", methods=["POST"])
def signup():
    d = request.json or {}

    # 🔐 basic validation
    if not d.get("mobile") or not d.get("password") or not d.get("role"):
        return jsonify(success=False, message="Missing required fields"), 400

    db = get_db()
    c = db.cursor()

    # ✅ approval rule
    # student → approved
    # faculty → pending
    approved = 1 if d["role"] == "student" else 0

    # 🚫 prevent duplicate mobile
    exists = c.execute(
        "SELECT id FROM users WHERE mobile=?",
        (d["mobile"],)
    ).fetchone()

    if exists:
        return jsonify(success=False, message="Mobile already exists"), 409

    # insert user
    c.execute(
        "INSERT INTO users (role, mobile, password, approved) VALUES (?,?,?,?)",
        (d["role"], d["mobile"], d["password"], approved)
    )
    uid = c.lastrowid

    # role specific data
    if d["role"] == "student":
        c.execute(
            "INSERT INTO students (user_id,fname,mname,lname) VALUES (?,?,?,?)",
            (uid, d.get("fname"), d.get("mname"), d.get("lname"))
        )

    elif d["role"] == "faculty":
        c.execute(
            """INSERT INTO faculty 
            (user_id,name,teacher_id,department,section)
            VALUES (?,?,?,?,?)""",
            (
                uid,
                d.get("name"),
                d.get("teacher_id"),
                d.get("department"),
                d.get("section")
            )
        )

    db.commit()
    return jsonify(success=True, message="Signup successful")

# ---------------- LOGIN ----------------
@auth.route("/login", methods=["POST"])
def login():
    db = get_db()
    d = request.json

    mobile = d.get("mobile")
    password = d.get("password")

    user = db.execute("""
        SELECT * FROM users
        WHERE mobile=? AND password=?
    """, (mobile, password)).fetchone()

    print("LOGIN QUERY RESULT:", dict(user) if user else "NO USER FOUND")

    if not user:
        return jsonify({"message": "Invalid id or password"}), 401

    if user["role"] == "admin":
        return jsonify(dict(user)), 200

    if user["role"] == "faculty" and user["approved"] != 1:
        return jsonify({"message": "Faculty not approved"}), 403

    return jsonify(dict(user)), 200
