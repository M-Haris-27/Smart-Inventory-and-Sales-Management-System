# SISMS - Smart Inventory & Sales Management System

A full-stack MERN application for managing inventory, sales, and customers with separate portals for staff and customers.

## Features

- **Admin Portal**: Full system access, analytics, user management
- **Staff Portal**: Manage products, inventory, customers, and process sales
- **Customer Portal**: Browse products, make purchases, view order history

## Tech Stack

- **Frontend**: React.js, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed (default: http://localhost:5000/api)
npm start
```

## User Roles

### Admin
- View analytics dashboard
- Manage all users
- Full access to all features

### Staff
- Manage products and inventory
- Process customer sales
- Manage customer records

### Customer
- Browse and search products
- Purchase products directly
- View order history
- Download receipts

## Project Structure

```
SISMS/
├── backend/              # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
│
└── frontend/            # React application
    ├── public/          # Static files
    └── src/
        ├── components/  # Reusable components
        ├── pages/       # Page components
        │   └── customer/  # Customer portal pages
        ├── redux/       # State management
        └── services/    # API services
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products (All authenticated users can view)
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Staff/Admin only)
- `PUT /api/products/:id` - Update product (Staff/Admin only)
- `DELETE /api/products/:id` - Delete product (Staff/Admin only)

### Sales
- `GET /api/sales` - Get sales (filtered by role)
- `POST /api/sales` - Create sale (All authenticated users)
- `DELETE /api/sales/:id` - Delete sale (Staff/Admin only)

### Customers (Staff/Admin only)
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Admin (Admin only)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reports` - Generate reports

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sisms
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Default Ports

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Testing the Application

1. Register as a customer at http://localhost:3000
2. Browse products and make a purchase
3. View your order history and download receipts
4. Register as admin/staff to access management portal

## License

MIT
