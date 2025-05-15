@echo off
REM Setup and run script for GitHub Insights Dashboard Backend

echo GitHub Insights Dashboard Backend Setup
echo ======================================

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create .env file from .env.example if it doesn't exist
if not exist .env (
    if exist .env.example (
        echo Creating .env from .env.example...
        copy .env.example .env
        
        echo .env file created from template. Please edit it to add your GitHub API token.
        echo.
        echo To get a GitHub API token:
        echo 1. Go to https://github.com/settings/tokens
        echo 2. Click "Generate new token"
        echo 3. Give it a name and select the following scopes:
        echo    - read:user
        echo    - repo (if you need access to private repositories)
        echo 4. Click "Generate token"
        echo 5. Copy the token and paste it in the .env file
        echo.
        
        echo Press any key to edit the .env file...
        pause > nul
        notepad .env
    ) else (
        echo No .env.example file found. Please create a .env file manually.
        exit /b 1
    )
)

REM Start the application
echo Starting the application...
python run.py --mode dev

REM Deactivate virtual environment on exit
call venv\Scripts\deactivate