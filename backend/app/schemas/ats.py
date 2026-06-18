from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict

class ATSAnalysisRequest(BaseModel):
    resume_id: int
    job_description: str

class SkillGapAnalysis(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]

class KeywordScore(BaseModel):
    keyword: str
    resume_frequency: int
    job_frequency: int

class ATSAnalysisResponse(BaseModel):
    score: float
    match_percentage: float
    resume_id: int
    job_description: str
    skill_gap: SkillGapAnalysis
    keyword_frequencies: List[KeywordScore]
    suggested_improvements: List[str]

    model_config = ConfigDict(from_attributes=True)
