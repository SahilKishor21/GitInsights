from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.services.github_service import github_service
from app.models.github_models import LanguageSummary, Error

router = APIRouter()

@router.get(
    "/{username}/languages",
    response_model=LanguageSummary,
    responses={404: {"model": Error}},
    summary="Get user languages summary",
    description="Retrieve a summary of all languages used across a user's repositories"
)
def get_user_languages_summary(username: str):
    """
    Get a summary of all languages used across a user's repositories.
    
    Args:
        username: GitHub username
    
    Returns:
        LanguageSummary: Summary of languages with totals and percentages
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        languages = github_service.get_user_languages_summary(username)
        
        total_bytes = sum(languages.values())
        
        percentages = {
            lang: (count / total_bytes) * 100 if total_bytes > 0 else 0
            for lang, count in languages.items()
        }
        
        return {
            "languages": languages,
            "total_bytes": total_bytes,
            "percentages": percentages
        }
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to fetch languages summary: {str(e)}"
        )


@router.get(
    "/{username}/{repo}/languages",
    response_model=Dict[str, int],
    responses={404: {"model": Error}},
    summary="Get repository languages",
    description="Retrieve language breakdown for a specific repository"
)
def get_repository_languages(username: str, repo: str):
    """
    Get language breakdown for a specific repository.
    
    Args:
        username: GitHub username
        repo: Repository name
    
    Returns:
        Dict[str, int]: Dictionary of languages and byte counts
    
    Raises:
        HTTPException: If repository not found or API error occurs
    """
    try:
        languages = github_service.get_repository_languages(username, repo)
        return languages
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to fetch repository languages: {str(e)}"
        )


@router.get(
    "/{username}/language-trends",
    response_model=Dict[str, Any],
    responses={404: {"model": Error}},
    summary="Get language usage trends",
    description="Analyze language usage trends across a user's repositories over time"
)
def get_language_trends(username: str):
    """
    Analyze language usage trends across a user's repositories over time.
    
    Args:
        username: GitHub username
    
    Returns:
        Dict: Language usage trends with timeline data
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        repos = github_service.get_user_repositories(username)
        

        sorted_repos = sorted(
            repos, 
            key=lambda x: x.get("created_at", "")
        )
        

        language_timeline = {}
        language_counts = {}
        
        for repo in sorted_repos:
            created_year = repo.get("created_at", "")[:4]
            language = repo.get("language")
            

            if not language or not created_year:
                continue
            
            if created_year not in language_timeline:
                language_timeline[created_year] = {}

            if language in language_timeline[created_year]:
                language_timeline[created_year][language] += 1
            else:
                language_timeline[created_year][language] = 1
            

            if language in language_counts:
                language_counts[language] += 1
            else:
                language_counts[language] = 1
        

        top_languages = dict(
            sorted(
                language_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10]  
        )
        

        consistent_timeline = {}
        for year in sorted(language_timeline.keys()):
            consistent_timeline[year] = {}
            

            for lang in top_languages:
                consistent_timeline[year][lang] = 0
            
            for lang, count in language_timeline[year].items():
                if lang in top_languages:
                    consistent_timeline[year][lang] = count
        
        return {
            "top_languages": top_languages,
            "language_timeline": consistent_timeline,
            "all_languages": language_counts
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to fetch language trends: {str(e)}"
        )