import React from 'react';
import { FiBox } from 'react-icons/fi';
import { Link, Outlet } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-white text-black p-4 shadow-md">
                <h1 className="text-xl font-bold text-[#1980E5] mb-6">Dashboard</h1>
                <nav>
                    <ul>
                        <li className="mb-4">
                            <Link
                                to="/products"
                                className="flex items-center p-2 hover:bg-[#1980E5] hover:text-white rounded-lg transition"
                            >
                                <FiBox className="text-xl mr-2" />
                                Products
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-[#F8F9FA] overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default Sidebar;