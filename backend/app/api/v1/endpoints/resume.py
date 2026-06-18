import pdfplumber
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.models.user import User
from app.models.resume import Resume
from app.services.resume_parser import ResumeParserService
from app.schemas.resume import ResumeResponse

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def upload_and_parse_resume(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Accepts raw PDF resume uploads, extracts text blocks dynamically, parses
    demographics/skills via NLP patterns, and saves structural history logs.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format details. Portfolio scanner only validates native PDF format objects."
        )

    try:
        # Scan PDF chunks in-memory securely using pdfplumber
        raw_text = ""
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    raw_text += extracted + "\n"
                    
        raw_text = ResumeParserService.extract_text_chunks(raw_text)
        
        if not raw_text.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Uploaded PDF appears blank or contains un-extractable geometric layers. Ensure native text formatting is preserved."
            )

        # Execute parser heuristics
        skills = ResumeParserService.extract_skills(raw_text)
        education = ResumeParserService.extract_education(raw_text)
        projects = ResumeParserService.extract_projects(raw_text)

        # Save record to postgres table
        db_resume = Resume(
            user_id=current_user.id,
            file_name=file.filename,
            raw_text=raw_text,
            extracted_skills=skills,
            extracted_education=education,
            extracted_projects=projects
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        
        return db_resume

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Automated extraction core engine warning: {str(e)}"
        )

@router.get("/history", response_model=List[ResumeResponse])
def get_resume_upload_history(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Returns lists of previously parsed resumes uploaded by the current authenticated session user.
    """
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes
