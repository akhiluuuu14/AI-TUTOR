from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, resume, ats, recommendations

api_router = APIRouter()

# Grouping endpoint modules under distinct prefix namespace sub-divisions
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(resume.router, prefix="/resume", tags=["Resume Analyzer"])
api_router.include_router(ats.router, prefix="/ats", tags=["ATS Calculator"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Job Recommendations"])
