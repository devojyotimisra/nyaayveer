from app import app, db
from application.models import User
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()

    if not User.query.filter_by(username="123456789").first():
        pwhashed = generate_password_hash("123456789")
        admin = User(username="123456789", password_hashed=pwhashed, name="admin", pincode=999999, contact_number=9999999999)
        db.session.add(admin)
        db.session.commit()
