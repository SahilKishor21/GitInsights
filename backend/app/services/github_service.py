import requests
import concurrent.futures
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GitHubService:
    """
    Service to interact with the GitHub API.
    Uses requests with thread pooling for performance.
    """
    
    def __init__(self):
        self.base_url = settings.GITHUB_API_URL
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        
        if settings.GITHUB_API_TOKEN:
            self.headers["Authorization"] = f"token {settings.GITHUB_API_TOKEN}"
        
        self.cache = {}
        self.cache_expiry = {}  
        self.cache_duration = settings.CACHE_EXPIRY  
        # Thread pool for concurrent requests
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=10)
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    def _make_request(self, url: str, params: Optional[Dict] = None) -> Any:
        """
        Make a request to the GitHub API with retries.
        
        Args:
            url: The API endpoint
            params: Optional query parameters
            
        Returns:
            JSON response data
        """
        cache_key = f"{url}_{str(params)}"
        current_time = datetime.now().timestamp()
        
        if cache_key in self.cache and current_time - self.cache_expiry.get(cache_key, 0) < self.cache_duration:
            logger.info(f"Returning cached data for {url}")
            return self.cache[cache_key]
        
        try:
            response = requests.get(url, params=params, headers=self.headers, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            # Update cache
            self.cache[cache_key] = data
            self.cache_expiry[cache_key] = current_time
            
            return data
        except requests.exceptions.RequestException as e:
            logger.error(f"HTTP error for {url}: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error making request to {url}: {str(e)}")
            raise
    
    def get_user_profile(self, username: str) -> Dict:
        """
        Get a GitHub user's profile information.
        
        Args:
            username: GitHub username
            
        Returns:
            User profile data
        """
        url = f"{self.base_url}/users/{username}"
        return self._make_request(url)
    
    def get_user_repositories(self, username: str, per_page: int = 100) -> List[Dict]:
        """
        Get a list of repositories for a GitHub user.
        
        Args:
            username: GitHub username
            per_page: Number of repositories per page
            
        Returns:
            List of repository data
        """
        url = f"{self.base_url}/users/{username}/repos"
        params = {"per_page": per_page, "sort": "updated"}
        
        all_repos = []
        page = 1
        
        while True:
            params["page"] = page
            repos = self._make_request(url, params)
            
            if not repos:
                break
            
            all_repos.extend(repos)
            
            if len(repos) < per_page:
                break
            
            page += 1
        
        return all_repos
    
    def get_repository_languages(self, username: str, repo_name: str) -> Dict:
        """
        Get language breakdown for a specific repository.
        
        Args:
            username: GitHub username
            repo_name: Repository name
            
        Returns:
            Dictionary of languages and byte counts
        """
        url = f"{self.base_url}/repos/{username}/{repo_name}/languages"
        return self._make_request(url)
    
    def get_user_events(self, username: str, per_page: int = 100) -> List[Dict]:
        """
        Get a user's recent GitHub activity.
        
        Args:
            username: GitHub username
            per_page: Number of events per page
            
        Returns:
            List of user activity events
        """
        url = f"{self.base_url}/users/{username}/events"
        params = {"per_page": per_page}
        
        all_events = []
        page = 1
        
        while True:
            params["page"] = page
            events = self._make_request(url, params)
            
            if not events:
                break
            
            all_events.extend(events)
            
            # GitHub API limits events to 300 or 10 pages
            if len(events) < per_page or page >= 10:
                break
            
            page += 1
        
        return all_events
    
    def get_repository_stats(self, username: str, repo_name: str) -> Dict:
        """
        Get detailed statistics for a repository.
        
        Args:
            username: GitHub username
            repo_name: Repository name
            
        Returns:
            Dictionary of repository statistics
        """
        url = f"{self.base_url}/repos/{username}/{repo_name}"
        repo_data = self._make_request(url)
        
        commit_url = f"{url}/stats/commit_activity"
        try:
            commit_activity = self._make_request(commit_url)
        except Exception:
            commit_activity = []
        
        contributors_url = f"{url}/stats/contributors"
        try:
            contributors = self._make_request(contributors_url)
        except Exception:
            contributors = []
        
        return {
            "info": repo_data,
            "commit_activity": commit_activity,
            "contributors": contributors
        }
    
    def get_user_languages_summary(self, username: str) -> Dict[str, int]:
        """
        Get a summary of all languages used across a user's repositories.
        
        Args:
            username: GitHub username
            
        Returns:
            Dictionary of languages and byte counts
        """
        repos = self.get_user_repositories(username)
        
        language_data_list = []
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [
                executor.submit(self.get_repository_languages, username, repo["name"])
                for repo in repos
            ]
            
            for future in concurrent.futures.as_completed(futures):
                try:
                    lang_data = future.result()
                    language_data_list.append(lang_data)
                except Exception as e:
                    logger.error(f"Error getting language data: {str(e)}")
        
        language_summary = {}
        for lang_data in language_data_list:
            for lang, bytes_count in lang_data.items():
                if lang in language_summary:
                    language_summary[lang] += bytes_count
                else:
                    language_summary[lang] = bytes_count
        
        return language_summary
    
    def get_activity_timeline(self, username: str, days: int = 30) -> Dict:
        """
        Get a structured timeline of user activity over a specified period.
        
        Args:
            username: GitHub username
            days: Number of days to include in the timeline
            
        Returns:
            Dictionary with activity data by day and type
        """
        events = self.get_user_events(username)
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        timeline = {
            "daily_activity": {},
            "event_counts": {},
            "repos_active": set(),
            "total_events": 0
        }
        
        for event in events:
            event_date = datetime.strptime(event["created_at"], "%Y-%m-%dT%H:%M:%SZ")
            
            if event_date < cutoff_date:
                continue
            
            date_key = event_date.strftime("%Y-%m-%d")
            event_type = event["type"]
            
            # Count events by day
            if date_key not in timeline["daily_activity"]:
                timeline["daily_activity"][date_key] = {"total": 0}
                
            if event_type not in timeline["daily_activity"][date_key]:
                timeline["daily_activity"][date_key][event_type] = 0
                
            timeline["daily_activity"][date_key][event_type] += 1
            timeline["daily_activity"][date_key]["total"] += 1

            if event_type not in timeline["event_counts"]:
                timeline["event_counts"][event_type] = 0
                
            timeline["event_counts"][event_type] += 1
            
            if "repo" in event:
                timeline["repos_active"].add(event["repo"]["name"])
            
            timeline["total_events"] += 1

        timeline["repos_active"] = list(timeline["repos_active"])
        
        return timeline

github_service = GitHubService()