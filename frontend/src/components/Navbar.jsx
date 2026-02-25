import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { authService } from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold">SISMS</h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link to="/dashboard" className="hover:text-blue-100 transition-colors font-medium">Dashboard</Link>
                        <Link to="/products" className="hover:text-blue-100 transition-colors font-medium">Products</Link>
                        <Link to="/sales" className="hover:text-blue-100 transition-colors font-medium">Orders</Link>
                        {user?.role === 'admin' && (
                            <Link to="/users" className="hover:text-blue-100 transition-colors font-medium">Users</Link>
                        )}

                        <div className="flex items-center space-x-4 ml-6 border-l border-white/20 pl-6">
                            <span className="text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                                {user?.name} <span className="text-blue-100">({user?.role})</span>
                            </span>
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
    );
};

export default Navbar;
