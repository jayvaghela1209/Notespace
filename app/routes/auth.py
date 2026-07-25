from flask import render_template, request, redirect, session, url_for, flash, Blueprint
from app import db
from app.models import User, Note

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/')
@auth_bp.route('/home')
def home():
    if 'user' in session:
        return redirect(url_for('notes.notes'))
    return redirect(url_for('auth.login'))

@auth_bp.route('/signup', methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        existing_user = User.query.filter_by(username=username).first()

        if existing_user:
            flash("User already exists. Please log in.", "error")
            return redirect(url_for('auth.signup'))
        
        new_user = User(username=username, password=password)

        db.session.add(new_user)
        db.session.commit()

        flash("Signup successful! Please log in.", "success")
        return redirect(url_for('auth.login'))
    return render_template('signup.html')

@auth_bp.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(username=username, password=password).first()

        if user:
            session['user'] = user.id
            flash("Login successfully!!")
            return redirect(url_for('notes.notes'))
        else:
            flash("Invalid username or password!", "error")
    return render_template("login.html")



@auth_bp.route('/logout')
def logout():
    session.pop('user', None)
    flash("Logged out successfully")
    return redirect(url_for('auth.login'))

