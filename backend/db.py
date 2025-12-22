import sqlite3

def init_db():
    con = sqlite3.connect("students.db")
    cur = con.cursor()

    # Users table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fname TEXT,
        lname TEXT,
        email TEXT,
        mobile TEXT UNIQUE,
        password TEXT
    )
    """)

    # Students table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        roll TEXT,
        dept TEXT,
        owner_mobile TEXT
    )
    """)

    con.commit()
    con.close()

init_db()
