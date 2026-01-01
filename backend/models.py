from db import get_db

def init_db():
    db = get_db()
    c = db.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT,
        mobile TEXT UNIQUE,
        password TEXT,
        approved INTEGER DEFAULT 0
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        fname TEXT,
        mname TEXT,
        lname TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS faculty (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        name TEXT,
        teacher_id TEXT,
        department TEXT,
        section TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS student_faculty (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        faculty_id INTEGER,
        student_id INTEGER,
        UNIQUE(faculty_id, student_id)
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER,
        receiver_id INTEGER,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    db.commit()
