"""API endpoint tests."""

from fastapi.testclient import TestClient
import pytest
from unittest.mock import patch, MagicMock
from app.main import app

client = TestClient(app)


@pytest.fixture
def mock_github_service():
    """Fixture for mocking the GitHub service."""
    with patch("app.services.github_service.GitHubService") as mock:
        # Create mock instance
        mock_instance = MagicMock()
        mock.return_value = mock_instance
        
        # Setup common mock returns
        mock_instance.get_user_profile.return_value = {
            "login": "testuser",
            "id": 12345,
            "name": "Test User",
            "public_repos": 10,
            "followers": 50,
            "following": 25,
            "created_at": "2020-01-01T00:00:00Z",
            "updated_at": "2023-01-01T00:00:00Z",
            "avatar_url": "https://github.com/testuser.png",
            "html_url": "https://github.com/testuser"
        }
        
        mock_instance.get_user_repositories.return_value = [
            {
                "id": 1,
                "name": "repo1",
                "full_name": "testuser/repo1",
                "owner": {"login": "testuser"},
                "html_url": "https://github.com/testuser/repo1",
                "description": "Test repository 1",
                "created_at": "2021-01-01T00:00:00Z",
                "updated_at": "2022-01-01T00:00:00Z",
                "pushed_at": "2022-01-01T00:00:00Z",
                "language": "Python",
                "stargazers_count": 10,
                "forks_count": 5
            }
        ]
        
        yield mock_instance


@pytest.mark.asyncio
async def test_get_user_profile(mock_github_service):
    """Test the user profile endpoint."""
    # Configure the mock
    mock_github_service.get_user_profile.return_value = {
        "login": "testuser",
        "id": 12345,
        "name": "Test User",
        "company": "Test Company",
        "blog": "https://testuser.com",
        "location": "Test City",
        "email": "test@example.com",
        "bio": "Test bio",
        "twitter_username": "testuser",
        "public_repos": 10,
        "public_gists": 5,
        "followers": 50,
        "following": 25,
        "created_at": "2020-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z",
        "avatar_url": "https://github.com/testuser.png",
        "html_url": "https://github.com/testuser"
    }
    
    # Make the request
    with patch("app.api.routes.user.github_service", mock_github_service):
        response = client.get("/api/v1/users/testuser")
    
    # Assert response
    assert response.status_code == 200
    assert response.json()["login"] == "testuser"
    assert response.json()["name"] == "Test User"
    assert response.json()["public_repos"] == 10


@pytest.mark.asyncio
async def test_get_user_repositories(mock_github_service):
    """Test the user repositories endpoint."""
    # Configure the mock
    mock_github_service.get_user_repositories.return_value = [
        {
            "id": 1,
            "name": "repo1",
            "full_name": "testuser/repo1",
            "owner": {"login": "testuser"},
            "html_url": "https://github.com/testuser/repo1",
            "description": "Test repository 1",
            "fork": False,
            "created_at": "2021-01-01T00:00:00Z",
            "updated_at": "2022-01-01T00:00:00Z",
            "pushed_at": "2022-01-01T00:00:00Z",
            "size": 1000,
            "stargazers_count": 10,
            "watchers_count": 10,
            "language": "Python",
            "forks_count": 5,
            "open_issues_count": 2,
            "license": {"key": "mit"},
            "topics": ["python", "api"],
            "default_branch": "main",
            "visibility": "public"
        }
    ]
    
    # Make the request
    with patch("app.api.routes.repositories.github_service", mock_github_service):
        response = client.get("/api/v1/users/testuser/repositories")
    
    # Assert response
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "repo1"
    assert response.json()[0]["language"] == "Python"


@pytest.mark.asyncio
async def test_get_user_languages(mock_github_service):
    """Test the user languages endpoint."""
    # Configure the mock
    mock_github_service.get_user_languages_summary.return_value = {
        "Python": 10000,
        "JavaScript": 5000,
        "HTML": 2000
    }
    
    # Make the request
    with patch("app.api.routes.languages.github_service", mock_github_service):
        response = client.get("/api/v1/users/testuser/languages")
    
    # Assert response
    assert response.status_code == 200
    assert response.json()["languages"]["Python"] == 10000
    assert response.json()["total_bytes"] == 17000
    assert abs(response.json()["percentages"]["Python"] - 58.82) < 0.1


@pytest.mark.asyncio
async def test_get_activity_timeline(mock_github_service):
    """Test the activity timeline endpoint."""
    # Configure the mock
    mock_github_service.get_activity_timeline.return_value = {
        "daily_activity": {
            "2023-01-01": {"total": 5, "PushEvent": 3, "CreateEvent": 2},
            "2023-01-02": {"total": 3, "PushEvent": 2, "IssueEvent": 1}
        },
        "event_counts": {
            "PushEvent": 5,
            "CreateEvent": 2,
            "IssueEvent": 1
        },
        "repos_active": ["testuser/repo1", "testuser/repo2"],
        "total_events": 8
    }
    
    # Make the request
    with patch("app.api.routes.activity.github_service", mock_github_service):
        response = client.get("/api/v1/users/testuser/activity-timeline")
    
    # Assert response
    assert response.status_code == 200
    assert response.json()["total_events"] == 8
    assert len(response.json()["repos_active"]) == 2
    assert response.json()["daily_activity"]["2023-01-01"]["total"] == 5