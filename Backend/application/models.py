from app import db
from datetime import datetime, timezone, timedelta
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    password_hashed: Mapped[str] = mapped_column(String(256), nullable=False)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    pincode: Mapped[int] = mapped_column(Integer, nullable=False)
    contact_number: Mapped[int] = mapped_column(Integer, nullable=False)

    chats: Mapped[List["Chats"]] = relationship("Chats", back_populates="user", cascade="all, delete-orphan")


class Chats(db.Model):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    case_number: Mapped[int] = mapped_column(Integer, nullable=False)
    case_name: Mapped[str] = mapped_column(String(100), nullable=False)
    messages: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone(timedelta(hours=5, minutes=30))))

    user: Mapped["User"] = relationship("User", back_populates="chats")
