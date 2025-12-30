import sqlite3

  

def init_db():
    con = sqlite3.connect("students.db")
    cur = con.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fname TEXT,
        lname TEXT,
        email TEXT,
        mobile TEXT UNIQUE,
        password TEXT,
        profile_pic TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        roll TEXT,
        dept TEXT,
        age INTEGER,
        owner_mobile TEXT
    )
    """)

    # Ensure profile_pic column exists
    cur.execute("PRAGMA table_info(users)")
    columns = [c[1] for c in cur.fetchall()]
    if "profile_pic" not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN profile_pic TEXT")

    con.commit()
    con.close()


init_db()
