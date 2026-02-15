import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { authService } from '../services/authService';

const CustomerLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold">SISMS Shop</h1>

                        <div className="flex items-center space-x-6">
                            <Link to="/customer/shop" className="hover:text-blue-200 transition">
                                Shop
                            </Link>
                            <Link to="/customer/orders" className="hover:text-blue-200 transition">
                                My Orders
                            </Link>

                            <div className="flex items-center space-x-4 ml-6 border-l border-blue-500 pl-6">
                                <span className="text-sm">{user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
