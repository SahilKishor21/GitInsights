from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any
import datetime

from app.services.github_service import github_service
from app.models.github_models import ActivityTimeline, Error

router = APIRouter()

@router.get(
    "/{username}/activity",
    response_model=List[Dict[str, Any]],
    responses={404: {"model": Error}},
    summary="Get user activity",
    description="Retrieve recent GitHub activity for a user"
)
def get_user_activity(
    username: str, 
    limit: int = Query(100, description="Number of events to return", le=100)
):
    """
    Get a user's recent GitHub activity.
    
    Args:
        username: GitHub username
        limit: Number of events to return (max 100)
    
    Returns:
        List[Dict]: List of user activity events
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        events = github_service.get_user_events(username)
        
        return events[:limit]
    
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to fetch user activity: {str(e)}"
        )


@router.get(
    "/{username}/activity-timeline",
    response_model=ActivityTimeline,
    responses={404: {"model": Error}},
    summary="Get activity timeline",
    description="Retrieve a structured timeline of user activity"
)
def get_activity_timeline(
    username: str,
    days: int = Query(30, description="Number of days to include in the timeline", le=90)
):
    """
    Get a structured timeline of user activity over a specified period.
    
    Args:
        username: GitHub username
        days: Number of days to include in the timeline (max 90)
    
    Returns:
        ActivityTimeline: Timeline of user activity
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        timeline = github_service.get_activity_timeline(username, days=days)
        return timeline
    
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to fetch activity timeline: {str(e)}"
        )


@router.get(
    "/{username}/contribution-heatmap",
    response_model=Dict[str, Any],
    responses={404: {"model": Error}},
    summary="Get contribution heatmap",
    description="Generate a data structure suitable for rendering a contribution heatmap"
)
def get_contribution_heatmap(
    username: str,
    days: int = Query(365, description="Number of days to include", le=365)
):
    """
    Generate contribution heatmap data (similar to GitHub's contribution graph).
    
    This is an approximation based on event data, as the actual contribution
    data is not directly available through the GitHub API.
    
    Args:
        username: GitHub username
        days: Number of days to include (max 365)
    
    Returns:
        Dict: Contribution heatmap data structure
    
    Raises:
        HTTPException: If user not found or API error occurs
    """
    try:
        
        timeline = github_service.get_activity_timeline(username, days=days)
        
        # Convert to heatmap format
        daily_contributions = {}
        
        for day_offset in range(days):
            date = (datetime.datetime.now() - datetime.timedelta(days=day_offset)).strftime("%Y-%m-%d")
            daily_contributions[date] = 0
    
        for date, data in timeline["daily_activity"].items():
            if date in daily_contributions:
                daily_contributions[date] = data["total"]
        
        current_streak = 0
        longest_streak = 0
        temp_streak = 0
        total_contributions = sum(daily_contributions.values())
        

        sorted_dates = sorted(daily_contributions.keys(), reverse=True)
        
        for date in sorted_dates:
            count = daily_contributions[date]

            if count > 0:
                current_streak += 1
            else:
                break
        
        for date in sorted(daily_contributions.keys()):
            count = daily_contributions[date]
            
            if count > 0:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 0
        
        contribution_values = list(daily_contributions.values())
        contribution_values.sort()
        
        q1_index = len(contribution_values) // 4
        q2_index = len(contribution_values) // 2
        q3_index = 3 * len(contribution_values) // 4
        
        q1 = contribution_values[q1_index] if contribution_values else 0
        q2 = contribution_values[q2_index] if contribution_values else 0
        q3 = contribution_values[q3_index] if contribution_values else 0
        
        return {
            "contributions": daily_contributions,
            "statistics": {
                "total_contributions": total_contributions,
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "days_with_contributions": sum(1 for c in daily_contributions.values() if c > 0),
                "total_days": days,
                "quartiles": [q1, q2, q3]
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to generate contribution heatmap: {str(e)}"
        )