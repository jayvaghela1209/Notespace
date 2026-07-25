from flask import Flask, render_template, request, redirect, url_for, flash
from app import db
from app.models import User, Note


app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

@app.route('/signup', methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        existing_user = User.query.filter_by(username=username).first()

        if existing_user:
            flash("User already exists. Please log in.", "error")
            return redirect(url_for('signup'))
        
        new_user = User(username=username, password=password)

        db.session.add(new_user)
        db.session.commit()

        flash("Signup successful! Please log in.", "success")
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(username=username, password=password).first()

        if user:
            flash("Login successfully!!")
            return redirect(url_for('notes'))
        
    return render_template("login.html")

