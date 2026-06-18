import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=False)
    
    # JSON fields to store dictionary schemas for skills, education, and projects
    extracted_skills = Column(JSON, nullable=False) # e.g., ["Python", "Docker"]
    extracted_education = Column(JSON, nullable=False) # e.g., [{"institution": "...", "degree": "...", "year": "..."}]
    extracted_projects = Column(JSON, nullable=False) # e.g., [{"title": "...", "description": "..."}]
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
