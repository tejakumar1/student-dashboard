from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import db

app = Flask(__name__)
CORS(app)

def get_db():
    return sqlite3.connect("students.db")

# ---------- SIGNUP ----------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("""
            INSERT INTO users (fname,lname,email,mobile,password)
            VALUES (?,?,?,?,?)
        """, (
            data["fname"], data["lname"],
            data["email"], data["mobile"], data["password"]
        ))
        con.commit()
        con.close()
        return jsonify({"success": True})
    except:
        return jsonify({"success": False, "msg": "Mobile already exists"})

# ---------- LOGIN ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    con = get_db()
    cur = con.cursor()
    cur.execute("""
        SELECT fname,lname,email,mobile
        FROM users WHERE mobile=? AND password=?
    """, (data["mobile"], data["password"]))
    row = cur.fetchone()
    con.close()

    if row:
        return jsonify({
            "success": True,
            "user": {
                "fname": row[0],
                "lname": row[1],
                "email": row[2],
                "mobile": row[3]
            }
        })
    return jsonify({"success": False})

# ---------- UPDATE PROFILE ----------
@app.route("/profile", methods=["PUT"])
def update_profile():
    data = request.json
    con = get_db()
    cur = con.cursor()
    cur.execute("""
        UPDATE users
        SET fname=?, lname=?, email=?
        WHERE mobile=?
    """, (data["fname"], data["lname"], data["email"], data["mobile"]))
    con.commit()
    con.close()
    return jsonify({"success": True})

# ---------- GET STUDENTS ----------
@app.route("/students/<mobile>")
def get_students(mobile):
    con = get_db()
    cur = con.cursor()
    cur.execute("""
        SELECT id,name,roll,dept FROM students
        WHERE owner_mobile=?
    """, (mobile,))
    rows = cur.fetchall()
    con.close()

    return jsonify([
        {"id": r[0], "name": r[1], "roll": r[2], "dept": r[3]}
        for r in rows
    ])

# ---------- ADD STUDENT ----------
@app.route("/students", methods=["POST"])
def add_student():
    data = request.json
    con = get_db()
    cur = con.cursor()
    cur.execute("""
        INSERT INTO students (name,roll,dept,owner_mobile)
        VALUES (?,?,?,?)
    """, (
        data["name"], data["roll"],
        data["dept"], data["mobile"]
    ))
    con.commit()
    con.close()
    return jsonify({"success": True})

# ---------- UPDATE STUDENT ----------
@app.route("/students/<int:id>", methods=["PUT"])
def update_student(id):
    data = request.json
    con = get_db()
    cur = con.cursor()
    cur.execute("""
        UPDATE students
        SET name=?, roll=?, dept=?
        WHERE id=?
    """, (data["name"], data["roll"], data["dept"], id))
    con.commit()
    con.close()
    return jsonify({"success": True})

# ---------- DELETE STUDENT ----------
@app.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    con = get_db()
    cur = con.cursor()
    cur.execute("DELETE FROM students WHERE id=?", (id,))
    con.commit()
    con.close()
    return jsonify({"success": True})



if __name__ == "__main__":
    app.run(debug=True)
