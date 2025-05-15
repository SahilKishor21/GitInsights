# GitHub Insights Dashboard Frontend

A React-based frontend for visualizing GitHub profile, repository, language, and activity data.

## Features

- **User Profile Dashboard**: Visualize GitHub user profiles and statistics
- **Repository Explorer**: Browse, sort, and filter repositories with detailed statistics
- **Language Analysis**: Visualize language usage across repositories with trends
- **Activity Tracking**: Analyze GitHub activity with contribution heatmaps and timelines
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React**: UI library
- **React Router**: Client-side routing
- **Recharts**: Data visualization library
- **Tailwind CSS**: Utility-first CSS framework
- **Context API**: State management

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd github-insights-dashboard/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The build files will be in the `build` directory.

## Project Structure

```
src/
├── api/                 # API client
├── components/          # React components
│   ├── common/          # Common UI components
│   ├── dashboard/       # Dashboard components
│   ├── repositories/    # Repository components
│   ├── languages/       # Language analysis components
│   └── activity/        # Activity visualization components
├── context/             # React Context providers
├── pages/               # Page components
├── utils/               # Utility functions
├── App.jsx              # Main application component
└── index.jsx            # Application entry point
```

## Development Guidelines

### Component Structure

- Each component should be in its own file
- Use functional components with hooks
- Keep components focused on a single responsibility
- Use proper prop validation

### Styling

- Use Tailwind CSS for styling
- Follow the design system for consistent UI
- Add custom CSS only when necessary
- Ensure mobile responsiveness

### State Management

- Use the UserContext for global state
- Use useState for component-local state
- Avoid prop drilling with context or custom hooks

## API Integration

The frontend communicates with the GitHub Insights API running at the URL specified in the `.env` file. In development, it proxies requests to the backend via the proxy config in `package.json`.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT
