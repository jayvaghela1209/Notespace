from flask import render_template, request, redirect, session, url_for, flash, Blueprint
from app import db
from app.models import User, Note
notes_bp = Blueprint('notes', __name__)

@notes_bp.route("/notes", methods = ["GET", "POST"])
def notes():
    if 'user' not in session:
        flash("please login to view notes!!")
        return redirect(url_for('auth.login'))
    if request.method == "POST":
        content = request.form.get("note")
        if content:
            new_note = Note(content = content, user_id=session['user'])
            db.session.add(new_note)
            db.session.commit()
            flash("note add successfully!!", 'success')
        return redirect(url_for('notes.notes'))
    notes = Note.query.filter_by(user_id=session['user']).all()
    return render_template("notes.html", notes = notes)

@notes_bp.route("/delete/<int:note_id>", methods = ["POST"])
def delete_note(note_id):
    note = Note.query.get(note_id)
    if note and note.user_id == session.get('user'):
        db.session.delete(note)
        db.session.commit()
        flash("Note deleted successfully!!", 'info')
    else:
        flash("You can only delete your own notes!", 'error')
    return redirect(url_for('notes.notes'))
