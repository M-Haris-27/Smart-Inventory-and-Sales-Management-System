import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">SISMS</h1>
                <div className="space-x-4">
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/products" className="hover:underline">Products</Link>
                    <Link to="/customers" className="hover:underline">Customers</Link>
                    <Link to="/sales" className="hover:underline">Sales</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
