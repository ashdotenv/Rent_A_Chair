import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";

const ProfileSidebar = () => {
    return (
        <div className="flex h-screen bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-5 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-[#1980E5]">Profile</h2>
                <nav className="flex flex-col gap-2">
                    <Link
                        to="/profile/settings"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-[#1980E5] hover:text-white transition"
                    >
                        <FiSettings /> Settings
                    </Link>
                    <Link
                        to="/profile/myorders"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-[#1980E5] hover:text-white transition"
                    >
                        <BsBoxSeam /> My Orders
                    </Link>
                </nav>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-5">
                <Outlet />
            </div>
        </div>
    );
};

export default ProfileSidebar;
