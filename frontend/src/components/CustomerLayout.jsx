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
        <div className="min-h-screen">
            <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold">SISMS Shop</h1>
                        </div>

                        <div className="flex items-center space-x-6">
                            <Link to="/customer/shop" className="hover:text-blue-100 transition-colors font-medium">
                                Shop
                            </Link>
                            <Link to="/customer/orders" className="hover:text-blue-100 transition-colors font-medium">
                                My Orders
                            </Link>

                            <div className="flex items-center space-x-4 ml-6 border-l border-white/20 pl-6">
                                <span className="text-sm bg-white/10 px-3 py-1.5 rounded-lg">{user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all font-medium"
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
