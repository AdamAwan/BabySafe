# BabySafe

A web application that provides food safety information during pregnancy using AI-powered analysis.

## Project Structure

```
babysafe/
├── frontend/                # React + Vite frontend application
│   ├── src/                # Frontend source code
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container configuration
│   └── nginx.conf         # Nginx configuration for production
│
├── backend/                # Node.js + Express backend application
│   ├── src/               # Backend source code
│   │   ├── __tests__/     # Test files
│   │   ├── services/      # Backend services
│   │   └── types/         # Backend type definitions
│   └── Dockerfile         # Backend container configuration
│
└── docker-compose.yml     # Docker services orchestration
```

## Features

- Search for food safety information during pregnancy
- AI-powered analysis of food safety
- Detailed explanations and recommendations
- Trusted medical source citations
- Mobile-responsive design

## Prerequisites

- Node.js 20 or later
- Docker and Docker Compose
- OpenAI API key

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/babysafe.git
cd babysafe
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create environment files:
```bash
# Backend (.env)
OPENAI_API_KEY=your_api_key
PORT=3001
FRONTEND_URL=http://localhost:5173
CACHE_TTL=3600
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
NODE_ENV=development

# Frontend (.env)
VITE_API_URL=http://localhost:3001/api
```

4. Start the development servers:
```bash
# Start backend (in backend directory)
npm run dev

# Start frontend (in frontend directory)
npm run dev
```

## Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:3001

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Security Features

- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers
- Source URL validation
- Request timeout and retry logic
- Error handling and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
