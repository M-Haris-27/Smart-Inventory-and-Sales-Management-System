# Smart Inventory & Sales Management System (SISMS)

A MERN stack application for managing inventory, sales, and customers.

## Project Duration
18th Jan to 18th Feb, 2026

## Technology Stack
- **Frontend**: React.js, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Project Structure
```
SISMS/
├── backend/          # Node.js + Express API
└── frontend/         # React.js application
```

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## User Roles
- **Admin**: Full system access, user management, analytics
- **Staff**: Manage products, stock, customers, and sales invoices

## Features
- Secure authentication using JWT
- Product and category management
- Stock in and stock out tracking
- Sales invoice generation
- Customer management
- Reports and dashboards
