import os
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# 1. Fetch cloud database URL if available, fallback to local SQLite for local dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dataset_studio.db")

# 2. Fix compatibility mismatch: Neon/Render use 'postgres://' but SQLAlchemy strictly requires 'postgresql://'
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Create engine configurations conditionally (SQLite requires check_same_thread, Postgres doesn't)
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class DatasetSession(Base):
    __tablename__ = "dataset_sessions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    prompt = Column(Text, nullable=True)
    schema = Column(JSON, nullable=True)          # {"dataset_name":"","target":"","columns":[...]}
    settings = Column(JSON, nullable=True)        # size, style, missing_pct, noise
    source = Column(String, nullable=True)        # "template" | "gemini"
    template_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)