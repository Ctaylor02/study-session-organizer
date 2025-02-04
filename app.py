from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Set up the SQLite database (it's stored in the project folder)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studyBuddy.db'  # This is the path to the SQLite DB file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To avoid a warning
db = SQLAlchemy(app)

# Define a StudyMaterial model (table)
class StudyMaterial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<StudyMaterial {self.title}>"

# Create the database and tables
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    materials = StudyMaterial.query.all()  # Get all materials from the database
    return render_template('index.html', materials=materials)

@app.route('/add_material', methods=['POST'])
def add_material():
    if request.method == 'POST':
        title = request.form['title']
        subject = request.form['subject']
        content = request.form['content']

        new_material = StudyMaterial(title=title, subject=subject, content=content)
        db.session.add(new_material)
        db.session.commit()

        return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)

