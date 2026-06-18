from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.models.user import User
from app.models.resume import Resume
from app.services.ats_calculator import ATSCalculatorService
from app.schemas.ats import ATSAnalysisRequest, ATSAnalysisResponse

router = APIRouter()

@router.post("/calculate", response_model=ATSAnalysisResponse, status_code=status.HTTP_200_OK)
def calculate_resume_ats_score(
    *,
    db: Session = Depends(get_db),
    payload: ATSAnalysisRequest,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Evaluates an existing resume in a user's upload library against a target 
    job description using advanced TF-IDF cosine similarity vector structures.
    """
    # Verify the target resume file exists and belongs to the authenticated session user
    resume = db.query(Resume).filter(
        Resume.id == payload.resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Specified resume document (ID: {payload.resume_id}) is not registered inside your account portfolio history."
        )

    if not payload.job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description text block cannot be empty. Please input technical keywords."
        )

    try:
        # Run comparison pipeline
        analysis = ATSCalculatorService.analyze_ats_score(
            resume_text=resume.raw_text,
            job_description=payload.job_description,
            resume_skills=resume.extracted_skills
        )

        return ATSAnalysisResponse(
            score=analysis["score"],
            match_percentage=analysis["match_percentage"],
            resume_id=payload.resume_id,
            job_description=payload.job_description,
            skill_gap=analysis["skill_gap"],
            keyword_frequencies=analysis["keyword_frequencies"],
            suggested_improvements=analysis["suggested_improvements"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Automated TF-IDF vector score compilation triggered error: {str(e)}"
        )
