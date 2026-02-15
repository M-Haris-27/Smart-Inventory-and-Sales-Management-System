# SISMS Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

## Initial Setup Steps

### 1. Clone and Initialize
```bash
git clone <your-repo-url>
cd SISMS
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sisms
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Install Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
```

Start frontend:
```bash
npm start
```

## Project Structure

### Backend Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Auth & validation middleware
├── models/          # Mongoose schemas
├── routes/          # API routes
├── utils/           # Helper functions
├── .env.example     # Environment template
├── package.json
└── server.js        # Entry point
```

### Frontend Structure
```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── redux/       # State management
│   │   └── slices/  # Redux slices
│   ├── services/    # API services
│   ├── App.js       # Main app component
│   ├── index.js     # Entry point
│   └── index.css    # Global styles
├── .env.example
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Testing the Setup

Backend health check:
```bash
curl http://localhost:5000
```

Test API endpoints:
```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin\",\"email\":\"admin@sisms.com\",\"password\":\"admin123\",\"role\":\"admin\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@sisms.com\",\"password\":\"admin123\"}"
```

Or import `backend/SISMS.postman_collection.json` into Postman for easier testing.

Frontend:
```
Open http://localhost:3000 in browser
```

## API Documentation

See `backend/API_DOCUMENTATION.md` for complete API reference with all endpoints, request/response formats, and examples.

## Next Steps
1. Implement authentication logic
2. Build product management features
3. Create sales and customer modules
4. Add dashboard analytics
5. Deploy to production

## Git Commands
```bash
git add .
git commit -m "Initial project structure"
git push origin main
```
