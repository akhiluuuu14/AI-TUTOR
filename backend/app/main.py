from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="FastAPI Backend for AI Career Coach portfolio system.",
        version="1.0.0",
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Set up CORS middleware
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Register API routers Group
    app.include_router(api_router, prefix=settings.API_V1_STR)

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "project": settings.PROJECT_NAME,
            "version": "1.0.0"
        }

    return app

app = create_app()
