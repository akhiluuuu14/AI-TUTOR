from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class EducationSchema(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    year: Optional[str] = None

class ProjectSchema(BaseModel):
    title: Optional[str] = None
    technologies: List[str] = []
    description: Optional[str] = None

class ResumeBase(BaseModel):
    file_name: str

class ResumeCreate(ResumeBase):
    raw_text: str
    extracted_skills: List[str] = []
    extracted_education: List[EducationSchema] = []
    extracted_projects: List[ProjectSchema] = []

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    raw_text: str
    extracted_skills: List[str]
    extracted_education: List[EducationSchema]
    extracted_projects: List[ProjectSchema]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
