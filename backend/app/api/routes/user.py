from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.services.github_service import github_service
from app.models.github_models import UserProfile, Error

router = APIRouter()

@router.get(
    "/{username}",
    response_model=UserProfile,
    responses={404: {"model": Error}},
    summary="Get GitHub user profile",
    description="Retrieve detailed profile information for a GitHub user"
)
def get_user_profile(username: str):
    """
    Get a GitHub user's profile information.
    
    Args:
        username: GitHub username
    
    Returns:
        UserProfile: User profile data
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        user_data = github_service.get_user_profile(username)
        return user_data
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"User not found: {str(e)}")


@router.get(
    "/{username}/summary",
    response_model=Dict[str, Any],
    responses={404: {"model": Error}},
    summary="Get GitHub user summary",
    description="Retrieve a comprehensive summary of a user's GitHub presence including profile, repositories, languages, and activity"
)
def get_user_summary(username: str):
    """
    Get a comprehensive summary of a user's GitHub presence.
    
    Args:
        username: GitHub username
    
    Returns:
        Dict: User summary including profile, repository stats, languages, and recent activity
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        profile = github_service.get_user_profile(username)
        repos = github_service.get_user_repositories(username)
        languages = github_service.get_user_languages_summary(username)
        activity = github_service.get_activity_timeline(username, days=30)
        
        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
        total_forks = sum(repo.get("forks_count", 0) for repo in repos)
        total_watchers = sum(repo.get("watchers_count", 0) for repo in repos)
        total_issues = sum(repo.get("open_issues_count", 0) for repo in repos)

        total_bytes = sum(languages.values())
        language_percentages = {
            lang: (count / total_bytes) * 100 if total_bytes > 0 else 0
            for lang, count in languages.items()
        }
        
        sorted_repos = sorted(
            repos, 
            key=lambda x: x.get("updated_at", ""), 
            reverse=True
        )
        recent_repos = [
            {
                "name": repo.get("name"),
                "full_name": repo.get("full_name"),
                "description": repo.get("description"),
                "html_url": repo.get("html_url"),
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "language": repo.get("language"),
                "updated_at": repo.get("updated_at")
            }
            for repo in sorted_repos[:5] 
        ]
        

        summary = {
            "profile": profile,
            "stats": {
                "total_repos": profile.get("public_repos", 0),
                "total_stars": total_stars,
                "total_forks": total_forks,
                "total_watchers": total_watchers,
                "total_issues": total_issues,
                "followers": profile.get("followers", 0),
                "following": profile.get("following", 0)
            },
            "languages": {
                "counts": languages,
                "total_bytes": total_bytes,
                "percentages": language_percentages
            },
            "activity": activity,
            "recent_repos": recent_repos
        }
        
        return summary
    
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"User summary failed: {str(e)}")