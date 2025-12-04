# Caden Outland , Landon Webb, Sravani Kadiyala

# SkillWise AI Tutor 🎓

An intelligent tutoring platform with AI-generated challenges, progress tracking, and peer review.

Stack: React (frontend), Node/Express (backend), PostgreSQL (primary DB), optional Mongo (profiles).

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (includes Docker Compose)
- Node.js 18+
- Git

Recommended: VS Code with Docker, ESLint, Prettier.

## 📦 Installation & Setup

### 1) Clone this repository

```powershell
git clone <your-fork-or-repo-url>
cd "C:\Users\Landon\Documents\Homework\Murray Work\CSC425FinalProject"
```

### 2. Environment Setup (Optional)

Create environment files if you need to customize settings:

#### Root `.env` (optional)

```env
# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Email Configuration (for notifications)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn-url
```

### 2) Start with Docker Compose

```powershell
# From the repo root
docker-compose up -d

# Tail logs (separate terminals are handy)
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

What this does:

- Provisions PostgreSQL and runs migrations
- Starts the backend API on `http://localhost:3001`
- Starts the frontend on `http://localhost:3000`

### 3) Access the app

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`
- Health check: `http://localhost:3001/healthz`

## 🛠 Development Workflow

### Common Docker commands

```powershell
# Start all services
docker-compose up -d

# Restart a service
docker-compose restart backend
docker-compose restart frontend

# Rebuild after dependency changes
docker-compose build --no-cache backend
docker-compose build --no-cache frontend

# Stop and remove containers
docker-compose down
```

### Working with the Code

#### Backend (Node.js/Express)

Key directories:

- `backend/src/routes/` — API endpoints
- `backend/src/controllers/` — business logic
- `backend/src/models/` — SQL models
- `backend/src/services/` — service layer
- `backend/src/middleware/` — auth/validation/error handlers
- `backend/database/migrations/` — schema

#### Frontend (React)

Key directories:

- `frontend/src/components/` — reusable components
- `frontend/src/pages/` — pages
- `frontend/src/services/api.js` — axios client with token refresh
- `frontend/src/contexts/AuthContext.jsx` — auth state
- `frontend/public/` — static assets

### Database

PostgreSQL is provisioned and migrated automatically.

Access details (default):

- Host: `localhost`
- Port: `5433` (container `5432` mapped)
- DB: `skillwise_db`
- User: `skillwise_user`
- Password: `skillwise_pass`

Connect via `psql`:

```powershell
psql -h localhost -p 5433 -U skillwise_user -d skillwise_db
```

## 🏗 Project Structure

```
SkillWise_AITutor/
├── 📁 frontend/                 # React frontend application
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable React components
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 utils/           # Utilities & API client
│   │   └── 📁 styles/          # CSS and styling
│   ├── 📄 package.json         # Frontend dependencies
│   └── 📄 Dockerfile.dev       # Frontend container config
│
├── 📁 backend/                  # Node.js backend API
│   ├── 📁 src/
│   │   ├── 📁 routes/          # API route handlers
│   │   ├── 📁 controllers/     # Business logic controllers
│   │   ├── 📁 models/          # Database models
│   │   ├── 📁 services/        # Service layer
│   │   ├── 📁 middleware/      # Express middleware
│   │   └── 📁 utils/           # Backend utilities
│   ├── 📁 database/
│   │   └── 📁 migrations/      # SQL migration files
│   ├── 📄 package.json         # Backend dependencies
│   └── 📄 Dockerfile.dev       # Backend container config
│
├── 📁 docs/                     # Documentation
├── 📄 docker-compose.yml       # Multi-service Docker setup
├── 📄 package.json            # Root package with scripts
└── 📄 README.md               # This file
```

## 🔧 Technology Stack

### Frontend

- **React 18** - UI library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Headless UI** - Accessible components

### Backend

- Node.js 18+
- Express.js
- PostgreSQL 15
- JWT (access + refresh tokens)
- Zod, Pino
- Optional: OpenAI/Gemini APIs for AI features

### Development

- **Docker & Docker Compose** - Containerization
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Backend testing
- **React Testing Library** - Frontend testing
- **Cypress** - E2E testing

## 🧪 Testing

Backend tests (container):

```powershell
docker-compose exec backend npm test
```

Frontend tests:

```powershell
docker-compose exec frontend npm test
```

Run with coverage:

```powershell
docker-compose exec backend npm run test:coverage
docker-compose exec frontend npm run test:coverage
```

### E2E Testing

```powershell
cd frontend
npx cypress open
```

## 📝 API

Once the backend is running:

- API Overview: `http://localhost:3001/api`
- Health: `http://localhost:3001/healthz`

Key endpoints:

- `POST /api/auth/login` — login
- `POST /api/auth/register` — register
- `POST /api/auth/refresh` — refresh access token
- `GET /api/users/profile` — current user
- `GET /api/challenges` — browse challenges
- `POST /api/ai/saveChallenge` — save generated challenge

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the ports
lsof -ti:3000  # Frontend
lsof -ti:3001  # Backend
lsof -ti:5433  # Database

# Kill processes if needed
kill -9 <PID>
```

#### Docker Issues

```bash
# Clean up and restart
npm run down
docker system prune -f
npm run dev:all
```

#### Database Connection Issues

```bash
# Check database logs
npm run logs:db

# Reset database
npm run down
docker volume rm skillwise_aitutor_postgres_data
npm run dev:all
```

#### Frontend Won't Load

```bash
# Check frontend logs
npm run logs:frontend

# Rebuild frontend container
docker-compose build --no-cache frontend
npm run dev:all
```

#### Backend API Errors

```bash
# Check backend logs
npm run logs:backend

# Rebuild backend container
docker-compose build --no-cache backend
npm run dev:all
```

### Development Tips

- Hot reloading enabled for both services
- Add schema changes under `backend/database/migrations/`
- Test APIs with Thunder Client/Postman
- Use Prettier + ESLint for clean diffs

### Troubleshooting

Common commands:

```powershell
# Restart services after changes
docker-compose restart backend
docker-compose restart frontend

# Clean and rebuild a service
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

## 📋 Development Checklist

When setting up for the first time:

- [ ] Install Docker Desktop
- [ ] Install Node.js (v18+)
- [ ] Install Git
- [ ] Clone the repository
- [ ] Run `npm install` in root directory
- [ ] Run `npm run dev:all`
- [ ] Verify frontend loads at http://localhost:3000
- [ ] Verify backend API at http://localhost:3001/api
- [ ] Install recommended VS Code extensions
- [ ] Set up environment variables (if using AI/email features)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 What You Get Out of the Box

This repository provides a complete, production-ready development environment with:

✅ **Full-stack application** running in Docker containers  
✅ **Database** with complete schema and migrations  
✅ **API** with authentication, validation, and error handling  
✅ **Frontend** with routing, forms, and responsive design  
✅ **Development tools** with hot reloading and debugging  
✅ **Code quality** with linting, formatting, and git hooks  
✅ **Testing setup** for unit, integration, and E2E tests  
✅ **Documentation** and development guidelines

Just run `npm run dev:all` and start coding! 🚀
