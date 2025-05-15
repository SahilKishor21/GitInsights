from fastapi import APIRouter

from app.api.routes import user, repositories, languages, activity

# Create main router
router = APIRouter()

# Include all route modules
router.include_router(user.router, prefix="/users", tags=["User Profiles"])
router.include_router(repositories.router, prefix="/users", tags=["Repositories"])
router.include_router(languages.router, prefix="/users", tags=["Languages"])
router.include_router(activity.router, prefix="/users", tags=["Activity"]) 
