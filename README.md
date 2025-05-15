# Project README 
# GitHub Insights Dashboard

![GitHub Insights Dashboard](https://via.placeholder.com/1200x600?text=GitHub+Insights+Dashboard)

A comprehensive analytics platform for GitHub profiles, providing in-depth analysis of repositories, language usage, and activity patterns. This full-stack application combines a FastAPI backend with a React frontend to deliver a seamless experience for exploring GitHub data.

## ✨ Features

- **User Profile Analysis**: Detailed breakdown of GitHub user profiles and statistics
- **Repository Analytics**: Explore repositories with advanced filtering and sorting
- **Language Breakdown**: Visualize programming language usage with interactive charts
- **Activity Tracking**: Monitor GitHub activity with contribution heatmaps and trends
- **Interactive Dashboard**: Clean, responsive UI with real-time data visualization
- **High Performance**: Async API with caching for fast response times

## 🚀 Tech Stack

### Backend
- **Python 3.9+**: Core programming language
- **FastAPI**: Modern, high-performance web framework 
- **Uvicorn/Gunicorn**: ASGI/WSGI servers for development and production
- **Pydantic**: Data validation and settings management
- **Httpx**: Asynchronous HTTP client for GitHub API requests

### Frontend
- **React**: Frontend library for building user interfaces
- **React Router**: Navigation and routing
- **Recharts**: Responsive charting library for visualizations
- **Tailwind CSS**: Utility-first CSS framework for styling

## 📊 Screenshots

<div align="center">
  <img src="./Screenshot 2025-05-15 212351.png" alt="Profile Summary" width="400" height="300"/>
  <img src="./Screenshot 2025-05-14 235521.png" alt="Repository Analysis" width="400" height="300"/>
  <img src="./Screenshot 2025-05-14 235622.png" alt="Language Charts" width="400" height="300"/>
</div>

## 🗂️ Project Structure

```
github-insights-dashboard/
├── backend/                       # FastAPI Backend Application
│   ├── app/
│   │   ├── api/                   # API endpoints
│   │   │   ├── routes/            # Route modules by feature
│   │   ├── models/                # Pydantic data models
│   │   ├── services/              # Business logic layer
│   │   └── utils/                 # Helper utilities
│   ├── tests/                     # Backend tests
│   ├── requirements.txt           # Python dependencies
│   └── run.py                     # Application runner
│
├── frontend/                      # React Frontend Application
│   ├── public/                    # Static files
│   ├── src/
│   │   ├── api/                   # API client
│   │   ├── components/            # React components
│   │   │   ├── common/            # Shared UI components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   ├── repositories/      # Repository components
│   │   │   ├── languages/         # Language analysis components
│   │   │   └── activity/          # Activity visualization components
│   │   ├── context/               # React context providers
│   │   ├── pages/                 # Page components
│   │   └── utils/                 # Frontend utilities
│   └── package.json               # Node.js dependencies
│
├── run-all.sh                    # Script to run both services (Unix)
├── run-all.bat                   # Script to run both services (Windows)
└── README.md                     # Project documentation
```

## ⚙️ Installation

### Prerequisites
- Python 3.9+
- Node.js 14+
- npm or yarn
- Git
- GitHub Personal Access Token

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/github-insights-dashboard.git
cd github-insights-dashboard

# Set up the backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with your GitHub token
cp .env.example .env
# Edit .env and add your GitHub token
```

### Frontend Setup

```bash
# Set up the frontend
cd ../frontend
npm install

# Create .env file if needed
cp .env.example .env
```

## 🚀 Running the Application

### Development Mode

```bash
# Run both services using the convenience script
# From project root:
# On Unix/Mac:
./run-all.sh

# On Windows:
run-all.bat
```

Or run each service separately:

```bash
# Backend (from backend directory)
python run.py --mode dev

# Frontend (from frontend directory)
npm start
```

### Production Mode

```bash
# Backend
python run.py --mode prod

# Frontend
npm run build
# Serve the build folder with a static file server
```

### Docker (optional)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🔍 Usage

1. Open your browser and navigate to http://localhost:3000
2. Enter a GitHub username in the search box
3. Explore the dashboard with various metrics and visualizations:
   - Overview: General user statistics and recent activity
   - Repositories: Detailed repository analysis
   - Languages: Programming language breakdown
   - Activity: Contribution patterns and event history

## 🔌 API Endpoints

The backend provides the following main endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/users/{username}` | Get GitHub user profile |
| `GET /api/v1/users/{username}/summary` | Get comprehensive user summary |
| `GET /api/v1/users/{username}/repositories` | Get user repositories |
| `GET /api/v1/users/{username}/languages` | Get language breakdown |
| `GET /api/v1/users/{username}/activity-timeline` | Get activity timeline |
| `GET /api/v1/users/{username}/contribution-heatmap` | Get contribution heatmap |

For complete API documentation, visit http://localhost:8000/docs when the backend is running.

## 🔧 Configuration

### Backend

Key environment variables in `.env`:

```
GITHUB_API_TOKEN=your_github_personal_access_token
DEBUG=True/False
CACHE_EXPIRY=3600  # Cache duration in seconds
```

### Frontend

Key environment variables in frontend `.env`:

```
REACT_APP_API_URL=  # Leave blank for development proxy
```

## ❓ Troubleshooting

### Common Issues

1. **API Rate Limits**: GitHub API has rate limits. The application implements caching to reduce API calls, but you may still hit limits with heavy usage.

2. **"Failed to fetch" errors**: Ensure the backend is running and accessible from the frontend. Check CORS settings and proxy configuration.

3. **Missing data**: Some users may have limited public information. The application handles missing data gracefully.

4. **Performance issues**: For users with many repositories, initial loading may take longer. The app implements pagination and caching to optimize performance.

### Debugging

- Backend logs: Check the terminal running the backend server
- Frontend console: Use browser developer tools to check for JavaScript errors
- API testing: Use the Swagger UI at http://localhost:8000/docs to test API endpoints directly

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [GitHub API](https://docs.github.com/en/rest) for providing the data
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend library
- [Recharts](https://recharts.org/) for the visualizations
- [Tailwind CSS](https://tailwindcss.com/) for the styling