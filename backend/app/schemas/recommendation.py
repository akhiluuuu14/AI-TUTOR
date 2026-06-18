from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class BridgeStep(BaseModel):
    skill: str
    action_step: str

class JobRecommendation(BaseModel):
    job_id: int
    title: str
    company: str
    location: str
    salary: str
    required_skills: List[str]
    description: str
    match_percentage: float
    fit_index: str
    matched_skills: List[str]
    missing_skills: List[str]
    bridge_roadmaps: List[BridgeStep]

    model_config = ConfigDict(from_attributes=True)

class RecommendationResponseList(BaseModel):
    resume_id: int
    candidate_skills: List[str]
    recommendations: List[JobRecommendation]

    model_config = ConfigDict(from_attributes=True)
