from os import getenv
from datetime import timedelta
from dotenv import load_dotenv


load_dotenv()


class Config:
    # Flask
    FLASK_DEBUG = getenv("FLASK_DEBUG", False)
    FLASK_RUN_HOST = getenv("FLASK_RUN_HOST")
    FLASK_RUN_PORT = getenv("FLASK_RUN_PORT")
    SECRET_KEY = getenv("SECRET_KEY")
    CACHE_TYPE = getenv("CACHE_TYPE")
    # SQLAlchemy
    SQLALCHEMY_DATABASE_URI = getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = getenv("SQLALCHEMY_TRACK_MODIFICATIONS", False)
    # JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    JWT_SECRET_KEY = getenv("JWT_SECRET_KEY")
    # Groq
    GROQ_API_KEY = getenv("GROQ_API_KEY")
