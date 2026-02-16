import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from './redux/slices/authSlice';
import { authService } from './services/authService';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import UserManagement from './pages/admin/UserManagement';
import Layout from './components/Layout';
import CustomerLayout from './components/CustomerLayout';
import CustomerShop from './pages/customer/CustomerShop';
import OrderHistory from './pages/customer/OrderHistory';

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = authService.getCurrentUser();
        if (token && user) {
            dispatch(setCredentials({ token, user }));
        }
    }, [dispatch]);

    const getDefaultRoute = () => {
        if (!isAuthenticated) return '/';
        return user?.role === 'customer' ? '/customer/shop' : '/dashboard';
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to={getDefaultRoute()} />} />

                {/* Staff/Admin Routes */}
                <Route element={isAuthenticated && user?.role !== 'customer' ? <Layout /> : <Navigate to="/" />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/users" element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />} />
                </Route>

                {/* Customer Routes */}
                <Route element={isAuthenticated && user?.role === 'customer' ? <CustomerLayout /> : <Navigate to="/" />}>
                    <Route path="/customer/shop" element={<CustomerShop />} />
                    <Route path="/customer/orders" element={<OrderHistory />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
