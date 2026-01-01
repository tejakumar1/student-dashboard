from flask import Flask
from flask_cors import CORS
from models import init_db
from auth import auth
from admin import admin
from faculty import faculty
from student import student
from messages import messages

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

init_db()

app.register_blueprint(auth)
app.register_blueprint(admin)
app.register_blueprint(faculty)
app.register_blueprint(student)
app.register_blueprint(messages)

if __name__ == "__main__":
    app.run(debug=True)
