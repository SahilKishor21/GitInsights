"""Pytest configuration file."""

import os
import pytest
from dotenv import load_dotenv

# Load environment variables from .env.test if it exists
if os.path.exists(".env.test"):
    load_dotenv(".env.test")
else:
    # Create test environment variables
    os.environ["GITHUB_API_TOKEN"] = "test_token"
    os.environ["DEBUG"] = "True"
    os.environ["CACHE_EXPIRY"] = "60"


@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Set up the test environment."""
    # Backup current environment
    old_environ = dict(os.environ)
    
    # Set test environment variables
    os.environ["GITHUB_API_TOKEN"] = os.environ.get("GITHUB_API_TOKEN", "test_token")
    os.environ["DEBUG"] = "True"
    os.environ["CACHE_EXPIRY"] = "60"
    
    yield
    
    # Restore original environment
    os.environ.clear()
    os.environ.update(old_environ)