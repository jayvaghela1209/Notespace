from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'your_secret_key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'

    db.init_app(app)
    from app.models import User, Note

    from app.routes import auth
    from app.routes import notes

    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(notes.notes_bp)

    
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('500.html'), 500

    with app.app_context():
        db.create_all()

    return app

