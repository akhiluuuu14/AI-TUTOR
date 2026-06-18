from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.models.user import User
from app.models.resume import Resume
from app.services.job_recommender import JobRecommenderService
from app.schemas.recommendation import RecommendationResponseList

router = APIRouter()

@router.get("/resume/{resume_id}", response_model=RecommendationResponseList, status_code=status.HTTP_200_OK)
def get_job_placement_recommendations(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Evaluates historical resume entities under the user's active login session,
    calculates technology skill-gaps against core software vacancies, and suggests bridge steps.
    """
    # Verify resume belongs to the authenticated account session
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No matching resume document with ID {resume_id} found inside your user account database."
        )

    try:
        # Pull details from SQL
        skills = resume.extracted_skills or []
        education = resume.extracted_education or []
        projects = resume.extracted_projects or []

        # Run multi-dimensional alignment calculation
        fit_results = JobRecommenderService.calculate_fit_analysis(
            candidate_skills=skills,
            candidate_education=education,
            candidate_projects=projects
        )

        return RecommendationResponseList(
            resume_id=resume.id,
            candidate_skills=skills,
            recommendations=fit_results
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Placement alignment recommendation matrix calculation triggered error: {str(e)}"
        )
