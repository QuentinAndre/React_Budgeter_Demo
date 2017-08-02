from app import db
from app.views import Response

db.reflect()
db.drop_all()
db.create_all()

users = Response.query.all()
for user in users:
    db.session.delete(user)
    db.session.commit()