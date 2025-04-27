from ast import literal_eval
from flask import Flask, request
from flask_caching import Cache
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.config.from_object("application.config.Config")
api = Api(app)
cache = Cache(app)
cors = CORS(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)


import application.init_db
from application.models import User, Chats
from application.detect_lang import detect_language
from application.hindi_to_english import hin2eng
from application.semantic_summary import sem_sum
from application.make_predictions import predict
from application.stt import transcribe
from application.ocr import img2txt


def login_required():
    def decorator(func):
        @jwt_required()
        @wraps(func)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            cache_key = f"user_cache:{user_id}"
            user_data = cache.get(cache_key)
            if not user_data:
                user = db.session.scalars(select(User).filter_by(username=user_id)).first()
                if not user:
                    return {"message": "User not found"}, 404
                cache.set(cache_key, user.id, timeout=600)
            return func(*args, **kwargs)
        return wrapper
    return decorator


class RegisterUser(Resource):
    register_parser = reqparse.RequestParser()
    register_parser.add_argument("id", type=str, required=True, help="Username is required")
    register_parser.add_argument("password", type=str, required=True, help="Password is required")
    register_parser.add_argument("name", type=str, required=True, help="Name is required")
    register_parser.add_argument("policeStaitionId", type=int, required=True, help="Pincode is required")
    register_parser.add_argument("mobileNo", type=int, required=True, help="Contact Number is required")

    def post(self):
        data = self.register_parser.parse_args()
        user = db.session.scalars(select(User).filter_by(username=data["id"])).first()
        if user:
            return {"message": "User already exists!"}, 401
        if not user:
            pwhash = generate_password_hash(data["password"])
            new_user = User(username=data["id"], password_hashed=pwhash, name=data["name"],
                            pincode=int(data["policeStaitionId"]), contact_number=int(data["mobileNo"]))
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity=data["id"])
            return {"token": access_token, "message": "Registration successful!"}, 200


class Login(Resource):
    login_parser = reqparse.RequestParser()
    login_parser.add_argument("id", type=str, required=True, help="Username is required")
    login_parser.add_argument("password", type=str, required=True, help="Password is required")

    def post(self):
        data = self.login_parser.parse_args()
        user = db.session.scalars(select(User).filter_by(username=data["id"])).first()
        if not user:
            return {"message": "Incorrect username or password"}, 401
        if not check_password_hash(user.password_hashed, data["password"]):
            return {"message": "Incorrect password"}, 403
        if user:
            if check_password_hash(user.password_hashed, data["password"]):
                access_token = create_access_token(identity=user.username)
                return {"token": access_token, "username": user.username, "message": "Logged in Successfully"}, 200


class CheckUser(Resource):
    @login_required()
    def get(self):
        user_id = get_jwt_identity()
        user = db.session.scalars(select(User).filter_by(username=user_id)).first()
        if not user:
            return {"message": "User not found"}, 404
        if user:
            user_data = {"unique_id": user.username, "name": user.name}
            return {"user": user_data}, 200


def predict_sections(incident):
    summary = sem_sum(incident)
    return predict(summary)


def predictions_of_incident(incident):
    if detect_language(incident) == "English":
        return predict_sections(incident), 200

    elif detect_language(incident) == "Hindi":
        incident = hin2eng(incident)
        return predict_sections(incident), 200

    else:
        return {"message": "Language not Identified"}, 404


class Text(Resource):
    @login_required()
    def post(self):
        data = request.json
        incident = data["data"]["text"]
        return predictions_of_incident(incident)


class Audio(Resource):
    @login_required()
    def post(self):
        data = request.json
        audio = data["data"]["uri"]
        incident = transcribe(audio)
        return predictions_of_incident(incident)


class Image(Resource):
    @login_required()
    def post(self):
        data = request.json
        image = data["data"]["uri"]
        incident = img2txt(image)
        return predictions_of_incident(incident)


class SaveChat(Resource):
    @login_required()
    def post(self):
        data = request.json["data"]
        chat = db.session.scalars(select(Chats)
                                  .join(Chats.user)
                                  .where(Chats.case_number == int(data["caseNumber"]),
                                         User.username == data["unique_id"])).first()
        if chat:
            return {"message": "Chat already Exists"}, 200
        user = db.session.scalars(select(User).filter_by(username=data["unique_id"])).first()
        if not user:
            return {"message": "User not found"}, 404
        chat_entry = Chats(user_id=user.id, case_number=int(data["caseNumber"]), case_name=data["name"], messages=str(data["messages"]))
        db.session.add(chat_entry)
        db.session.commit()
        return {"message": "Saved Chat Successfully"}, 201


class GetChat(Resource):
    @login_required()
    def get(self, user_id, case_number):
        chat = db.session.scalars(select(Chats)
                                  .join(Chats.user)
                                  .where(User.username == user_id,
                                         Chats.case_number == int(case_number))).first()
        if not chat:
            return {"message": "Chat Not Found!"}, 404
        return {"messages": literal_eval(chat.messages)}, 200


class GetCases(Resource):
    @login_required()
    def get(self, user_id):
        data = db.session.scalars(select(Chats)
                                  .join(Chats.user)
                                  .where(User.username == str(user_id))
                                  .order_by(Chats.created_at.desc())).all()
        data_json = []
        for chat in data:
            data_json.append({
                "content": [f"{chat.case_number}: {chat.case_name}"],
                "date": chat.created_at.isoformat()
            })
        return {"data": data_json}, 200


api.add_resource(RegisterUser, "/api/signup")
api.add_resource(Login, "/api/login")
api.add_resource(CheckUser, "/api/user")
api.add_resource(Text, "/api/text")
api.add_resource(Audio, "/api/audio")
api.add_resource(Image, "/api/image")
api.add_resource(SaveChat, "/api/data/saveData")
api.add_resource(GetChat, "/api/data/getData/messages/<string:user_id>/<string:case_number>")
api.add_resource(GetCases, "/api/data/cases/<string:user_id>")


if __name__ == "__main__":
    app.run()
