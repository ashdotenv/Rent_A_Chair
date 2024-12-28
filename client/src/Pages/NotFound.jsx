import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({ isDarkMode }) => {
    return (
        <>
            <div
                className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${
                    isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
                }`}
            >
                {/* Top-left blob */}
                <div
                    className={`absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-3xl ${
                        isDarkMode
                            ? 'bg-[#1D4ED8] opacity-30'
                            : 'bg-[#1980E5] opacity-30'
                    }`}
                ></div>

                {/* Top-right blob */}
                <div
                    className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-3xl ${
                        isDarkMode
                            ? 'bg-[#1D4ED8] opacity-30'
                            : 'bg-[#1980E5] opacity-30'
                    }`}
                ></div>

                {/* Bottom-left blob */}
                <div
                    className={`absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full filter blur-2xl ${
                        isDarkMode
                            ? 'bg-[#1D4ED8] opacity-20'
                            : 'bg-[#1980E5] opacity-20'
                    }`}
                ></div>

                {/* Bottom-right blob */}
                <div
                    className={`absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full filter blur-2xl ${
                        isDarkMode
                            ? 'bg-[#1D4ED8] opacity-20'
                            : 'bg-[#1980E5] opacity-20'
                    }`}
                ></div>

                <div className="text-center">
                    <h1
                        className={`text-9xl font-extrabold ${
                            isDarkMode ? 'text-[#1D4ED8]' : 'text-[#1980E5]'
                        }`}
                    >
                        404
                    </h1>
                    <p
                        className={`mt-4 text-xl ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                        Oops! The page you're looking for can't be found.
                    </p>
                    <Link
                        to="/"
                        className={`mt-6 inline-block px-6 py-3 rounded-md shadow-md transition ${
                            isDarkMode
                                ? 'text-white bg-[#1D4ED8] hover:bg-[#1643a3]'
                                : 'text-white bg-[#1980E5] hover:bg-[#136bbf]'
                        }`}
                    >
                        Go Back Home
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotFound;
