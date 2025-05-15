#!/usr/bin/env python3
"""
GitHub Insights Dashboard API runner.

This script provides a convenient way to run the application in development
or production mode.
"""

import os
import sys
import argparse
import uvicorn
import platform
from app.config import settings

# Check if running on Windows
IS_WINDOWS = platform.system() == "Windows"

# Import Gunicorn only on non-Windows platforms
if not IS_WINDOWS:
    import gunicorn.app.base
    
    class StandaloneApplication(gunicorn.app.base.BaseApplication):
        """Gunicorn application for running the API in production mode."""
        
        def __init__(self, app, options=None):
            self.options = options or {}
            self.application = app
            super().__init__()

        def load_config(self):
            """Load the Gunicorn configuration."""
            config = {
                key: value for key, value in self.options.items()
                if key in self.cfg.settings and value is not None
            }
            for key, value in config.items():
                self.cfg.set(key.lower(), value)

        def load(self):
            """Load the WSGI application."""
            return self.application


def run_dev():
    """Run the application in development mode using Uvicorn."""
    print(f"Starting GitHub Insights API in development mode at http://{settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level="info"
    )


def run_prod():
    """Run the application in production mode using Gunicorn."""
    if IS_WINDOWS:
        print("Error: Production mode with Gunicorn is not supported on Windows.")
        print("Please use development mode or deploy on a Linux/Unix system.")
        print("Alternatively, you can use a Windows-compatible production server like Waitress.")
        print("\nRunning in development mode instead...\n")
        run_dev()
        return
        
    # Import app inside function to prevent circular imports
    from app.main import app
    
    # Load configuration from gunicorn_conf.py
    gunicorn_config = {
        "bind": f"{settings.HOST}:{settings.PORT}",
        "workers": settings.WORKERS,
        "worker_class": "uvicorn.workers.UvicornWorker",
        "accesslog": "-",
        "errorlog": "-",
        "timeout": 120,
        "keepalive": 5,
        "preload_app": True,
        "graceful_timeout": 120
    }
    
    print(f"Starting GitHub Insights API in production mode at http://{settings.HOST}:{settings.PORT}")
    
    # Run with Gunicorn
    StandaloneApplication(app, gunicorn_config).run()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the GitHub Insights Dashboard API")
    parser.add_argument(
        "--mode", 
        type=str, 
        choices=["dev", "prod"], 
        default="dev",
        help="Run in development or production mode"
    )
    
    args = parser.parse_args()
    
    print(f"Starting GitHub Insights Dashboard API in {args.mode} mode")
    
    if args.mode == "dev":
        run_dev()
    else:
        run_prod()