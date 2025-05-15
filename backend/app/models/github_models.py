from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime


class UserProfile(BaseModel):
    """GitHub user profile model."""
    login: str
    id: int
    name: Optional[str] = None
    company: Optional[str] = None
    blog: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    twitter_username: Optional[str] = None
    public_repos: int
    public_gists: int
    followers: int
    following: int
    created_at: datetime
    updated_at: datetime
    avatar_url: str
    html_url: str


class Repository(BaseModel):
    """GitHub repository model."""
    id: int
    name: str
    full_name: str
    owner: Dict[str, Any]
    html_url: str
    description: Optional[str] = None
    fork: bool
    created_at: datetime
    updated_at: datetime
    pushed_at: datetime
    homepage: Optional[str] = None
    size: int
    stargazers_count: int
    watchers_count: int
    language: Optional[str] = None
    forks_count: int
    open_issues_count: int
    license: Optional[Dict[str, Any]] = None
    topics: List[str] = Field(default_factory=list)
    default_branch: str
    visibility: Optional[str] = None


class LanguageSummary(BaseModel):
    """Language summary model with totals and percentages."""
    languages: Dict[str, int]
    total_bytes: int
    percentages: Dict[str, float]


class CommitActivity(BaseModel):
    """Weekly commit activity model."""
    total: int
    week: int
    days: List[int]


class Contributor(BaseModel):
    """Repository contributor model."""
    author: Dict[str, Any]
    total: int
    weeks: List[Dict[str, Any]]


class RepositoryStats(BaseModel):
    """Repository statistics model."""
    info: Dict[str, Any]
    commit_activity: List[Dict[str, Any]] = Field(default_factory=list)
    contributors: List[Dict[str, Any]] = Field(default_factory=list)


class ActivityTimeline(BaseModel):
    """User activity timeline model."""
    daily_activity: Dict[str, Dict[str, int]]
    event_counts: Dict[str, int]
    repos_active: List[str]
    total_events: int


class Error(BaseModel):
    """Error response model."""
    detail: str