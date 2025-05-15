from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any

from app.services.github_service import github_service
from app.models.github_models import Repository, RepositoryStats, Error

router = APIRouter()

@router.get(
    "/{username}/repositories",
    response_model=List[Repository],
    responses={404: {"model": Error}},
    summary="Get user repositories",
    description="Retrieve a list of repositories for a GitHub user"
)
def get_user_repositories(
    username: str,
    sort: str = Query("updated", description="Sort repositories by (updated, created, pushed, full_name)"),
    direction: str = Query("desc", description="Sort direction (asc, desc)"),
    per_page: int = Query(100, description="Number of repositories per page", le=100)
):
    """
    Get a list of repositories for a GitHub user.
    
    Args:
        username: GitHub username
        sort: Sort repositories by (updated, created, pushed, full_name)
        direction: Sort direction (asc, desc)
        per_page: Number of repositories per page (max 100)
    
    Returns:
        List[Repository]: List of repository data
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        repos = github_service.get_user_repositories(username, per_page=per_page)
        
        # Perform sorting
        if sort in ["updated", "created", "pushed"]:
            repos = sorted(
                repos,
                key=lambda x: x.get(f"{sort}_at", ""),
                reverse=(direction.lower() == "desc")
            )
        elif sort == "full_name":
            repos = sorted(
                repos,
                key=lambda x: x.get("full_name", "").lower(),
                reverse=(direction.lower() == "desc")
            )
        
        return repos
    except Exception as e:
        raise HTTPException(
            status_code=404, 
            detail=f"Unable to fetch repositories: {str(e)}"
        )


@router.get(
    "/{username}/{repo}/stats",
    response_model=RepositoryStats,
    responses={404: {"model": Error}},
    summary="Get repository statistics",
    description="Retrieve detailed statistics for a specific repository"
)
def get_repository_stats(username: str, repo: str):
    """
    Get detailed statistics for a repository.
    
    Args:
        username: GitHub username
        repo: Repository name
    
    Returns:
        RepositoryStats: Detailed repository statistics
    
    Raises:
        HTTPException: If repository not found or API error occurs
    """
    try:
        stats = github_service.get_repository_stats(username, repo)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=404, 
            detail=f"Unable to fetch repository stats: {str(e)}"
        )


@router.get(
    "/{username}/repository-insights",
    response_model=Dict[str, Any],
    responses={404: {"model": Error}},
    summary="Get repository insights",
    description="Retrieve insights across all repositories for a GitHub user"
)
def get_repository_insights(username: str):
    """
    Get insights across all repositories for a GitHub user.
    
    Args:
        username: GitHub username
    
    Returns:
        Dict: Repository insights including statistics and trends
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        repos = github_service.get_user_repositories(username)
        
        insights = {
            "total_count": len(repos),
            "language_distribution": {},
            "fork_count": 0,
            "original_count": 0,
            "stars_count": 0,
            "most_starred": None,
            "most_forked": None,
            "created_timeline": {},
            "updated_timeline": {}
        }
        
        max_stars = -1
        max_forks = -1
        
        for repo in repos:

            if repo.get("fork", False):
                insights["fork_count"] += 1
            else:
                insights["original_count"] += 1
            
            stars = repo.get("stargazers_count", 0)
            insights["stars_count"] += stars
            
            if stars > max_stars:
                max_stars = stars
                insights["most_starred"] = {
                    "name": repo.get("name"),
                    "full_name": repo.get("full_name"),
                    "html_url": repo.get("html_url"),
                    "stars": stars,
                    "description": repo.get("description")
                }
            

            forks = repo.get("forks_count", 0)
            if forks > max_forks:
                max_forks = forks
                insights["most_forked"] = {
                    "name": repo.get("name"),
                    "full_name": repo.get("full_name"),
                    "html_url": repo.get("html_url"),
                    "forks": forks,
                    "description": repo.get("description")
                }
            
            language = repo.get("language")
            if language:
                if language in insights["language_distribution"]:
                    insights["language_distribution"][language] += 1
                else:
                    insights["language_distribution"][language] = 1
            
            created_year = repo.get("created_at", "")[:4]  # Get year portion
            if created_year:
                if created_year in insights["created_timeline"]:
                    insights["created_timeline"][created_year] += 1
                else:
                    insights["created_timeline"][created_year] = 1
            
            updated_year = repo.get("updated_at", "")[:4]  # Get year portion
            if updated_year:
                if updated_year in insights["updated_timeline"]:
                    insights["updated_timeline"][updated_year] += 1
                else:
                    insights["updated_timeline"][updated_year] = 1
        

        insights["language_distribution"] = dict(
            sorted(
                insights["language_distribution"].items(),
                key=lambda x: x[1],
                reverse=True
            )
        )

        insights["created_timeline"] = dict(
            sorted(insights["created_timeline"].items())
        )
        insights["updated_timeline"] = dict(
            sorted(insights["updated_timeline"].items())
        )
        
        return insights
    
    except Exception as e:
        raise HTTPException(
            status_code=404, 
            detail=f"Unable to fetch repository insights: {str(e)}"
        )