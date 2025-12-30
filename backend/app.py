from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import db

app = Flask(__name__)
CORS(app)

def get_db():
    return sqlite3.connect("students.db")

# ---------- SIGNUP ----------
import sqlite3
def init_db():
    con = get_db()
    cur = con.cursor()
    cur.execute("PRAGMA table_info(students)")
    columns = [c[1] for c in cur.fetchall()]

    if "age" not in columns:
        cur.execute("ALTER TABLE students ADD COLUMN age INTEGER")

    con.commit()
    con.close()

init_db()


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
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "msg": "Mobile already registered"})
    except Exception as e:
        return jsonify({"success": False, "msg": "Server error"})




# ---------- LOGIN ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    con = get_db()
    cur = con.cursor()
    cur.execute("""
        SELECT fname,lname,email,mobile,profile_pic
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
                "mobile": row[3],
                "profile_pic": row[4]
            }
        })
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


# ---------- UPDATE PROFILE ----------



@app.route("/profile", methods=["PUT"])
def update_profile():
    fname = request.form.get("fname")
    lname = request.form.get("lname")
    email = request.form.get("email")
    mobile = request.form.get("mobile")

    profile_pic = request.files.get("profile_pic")
    filename = None

    if profile_pic:
        filename = secure_filename(profile_pic.filename)
        profile_pic.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    con = get_db()
    cur = con.cursor()

    if filename:
        cur.execute("""
            UPDATE users
            SET fname=?, lname=?, email=?, profile_pic=?
            WHERE mobile=?
        """, (fname, lname, email, filename, mobile))
    else:
        cur.execute("""
            UPDATE users
            SET fname=?, lname=?, email=?
            WHERE mobile=?
        """, (fname, lname, email, mobile))

    con.commit()
    con.close()

    return jsonify({
        "success": True,
        "user": {
            "fname": fname,
            "lname": lname,
            "email": email,
            "mobile": mobile,
            "profile_pic": filename
        }
    })


# ---------- ADD STUDENT ----------
@app.route("/students", methods=["POST"])
def add_student():
    data = request.json
    con = get_db()
    cur = con.cursor()
    cur.execute("""
        INSERT INTO students (name,roll,dept,age,owner_mobile)
        VALUES (?,?,?,?,?)
    """, (
        data["name"], data["roll"],
        data["dept"], data["age"], data["mobile"]
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
        SET name=?, roll=?, dept=?, age=?
        WHERE id=?
    """, (data["name"], data["roll"], data["dept"], data["age"], id))
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



# ---------- GET STUDENTS WITH FILTERS ----------
@app.route("/students", methods=["GET"])
def get_students_filtered():
    name = request.args.get("name", "")
    age = request.args.get("age")

    con = get_db()
    cur = con.cursor()

    query = """
        SELECT id, name, roll, dept, age
        FROM students
        WHERE 1=1
    """
    params = []

    if name:
        query += " AND LOWER(name) LIKE ?"
        params.append(f"%{name.lower()}%")

    if age:
        query += " AND age = ?"
        params.append(age)

    cur.execute(query, params)
    rows = cur.fetchall()
    con.close()

    return jsonify([
        {
            "id": r[0],
            "name": r[1],
            "roll": r[2],
            "dept": r[3],
            "age": r[4],
        }
        for r in rows
    ])

#----------image storage path creating in bd
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)

