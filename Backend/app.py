from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ================= CONFIG =================
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///learncircle.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ================= MODELS =================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    clerk_user_id = db.Column(db.String(200), unique=True)
    username = db.Column(db.String(80))
    email = db.Column(db.String(120))
    role = db.Column(db.String(20), default="student")
    points = db.Column(db.Integer, default=0)
    reputation_level = db.Column(db.Integer, default=1)
    join_date = db.Column(db.DateTime, default=datetime.utcnow)


class Circle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    circle_id = db.Column(db.Integer)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    user_id = db.Column(db.Integer)
    circle_id = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# ================= HELPERS =================

def get_user_from_clerk(clerk_id):
    return User.query.filter_by(clerk_user_id=clerk_id).first()


# ================= USER SYNC =================

@app.route('/api/sync-user', methods=['POST'])
def sync_user():
    data = request.get_json()

    clerk_id = data.get('clerkId')
    email = data.get('email')
    username = data.get('username', '')

    if not clerk_id:
        return jsonify({'error': 'Missing clerkId'}), 400

    user = User.query.filter_by(clerk_user_id=clerk_id).first()

    if not user:
        user = User(
            clerk_user_id=clerk_id,
            email=email,
            username=username
        )
        db.session.add(user)
        db.session.commit()

    return jsonify({'message': 'User synced'})


# ================= GET SINGLE CIRCLE =================

@app.route('/api/circles/<int:id>')
def get_circle(id):
    c = Circle.query.get_or_404(id)

    return jsonify({
        "id": c.id,
        "title": c.title,
        "description": c.description
    })


# ================= CIRCLES =================

@app.route('/api/circles', methods=['GET', 'POST'])
def circles():
    if request.method == 'POST':
        data = request.get_json()

        user = get_user_from_clerk(data.get('clerk_id'))
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401

        circle = Circle(
            title=data['title'],
            description=data['description'],
            creator_id=user.id
        )

        db.session.add(circle)
        db.session.commit()

        return jsonify({'message': 'Circle created'})

    circles = Circle.query.all()

    return jsonify([{
        "id": c.id,
        "title": c.title,
        "description": c.description
    } for c in circles])


# ================= TASKS =================

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()

    user = get_user_from_clerk(data.get('clerk_id'))
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    task = Task(
        title=data['title'],
        description=data['description'],
        circle_id=data['circle_id']
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({'message': 'Task added'})


@app.route('/api/circles/<int:id>/tasks')
def get_tasks(id):
    tasks = Task.query.filter_by(circle_id=id).all()

    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description
    } for t in tasks])


# ================= CHAT =================

@app.route('/api/circles/<int:id>/messages', methods=['GET', 'POST'])
def messages(id):
    if request.method == 'POST':
        data = request.get_json()

        user = get_user_from_clerk(data.get('clerk_id'))
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401

        msg = Message(
            text=data['text'],
            user_id=user.id,
            circle_id=id
        )

        db.session.add(msg)
        db.session.commit()

        return jsonify({'message': 'Message sent'})

    msgs = Message.query.filter_by(circle_id=id).all()

    result = []
    for m in msgs:
        user = User.query.get(m.user_id)

        result.append({
            "text": m.text,
            "user_id": m.user_id,
            "clerk_user_id": user.clerk_user_id,
            "username": user.username
        })

    return jsonify(result)


# ================= ADMIN =================

@app.route('/api/admin')
def admin_panel():
    clerk_id = request.args.get("clerk_id")

    user = get_user_from_clerk(clerk_id)

    if not user or user.role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({"message": "Welcome Admin 🔥"})


# ================= SEED DATA =================

def seed_data():
    if User.query.first():
        return

    u1 = User(clerk_user_id="test123", username="mayank", email="mayank@gmail.com", role="admin")
    u2 = User(clerk_user_id="test456", username="user", email="user@gmail.com")

    db.session.add_all([u1, u2])
    db.session.commit()

    c1 = Circle(title="DSA Circle", description="Practice daily", creator_id=1)
    c2 = Circle(title="Web Dev Circle", description="Build projects", creator_id=2)

    db.session.add_all([c1, c2])
    db.session.commit()

    t1 = Task(title="Solve 5 problems", description="Arrays", circle_id=1)
    t2 = Task(title="Build UI", description="React", circle_id=2)

    db.session.add_all([t1, t2])
    db.session.commit()

    print("✅ Seed data added")


# ================= ROOT =================

@app.route('/')
def home():
    return "Backend running 🚀"


# ================= RUN =================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_data()

    app.run(debug=True)