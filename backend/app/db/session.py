from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Create PostgreSQL database engine setup
# pool_pre_ping helps detect and recover from dropped connections automatically
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    """
    Database dependency maker to handle opening and closing connections 
    per request context safely to avoid memory leakage.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
