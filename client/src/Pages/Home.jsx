import React, { useEffect } from 'react';
import {
    FiFacebook,
    FiTwitter,
    FiInstagram,
    FiGithub
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useMyDetailsQuery } from '../Redux/Service';
import { addMyInfo } from '../Redux/slice';

// Placeholder image URLs - Replace with your actual image paths
const heroImageUrl = "https://placehold.co/1200x320/EEE/31343C?text=Modern+Furniture&font=Montserrat";
const sofaImageUrl = "https://placehold.co/300x200/EEE/31343C?text=Sofas&font=Montserrat";
const bedImageUrl = "https://placehold.co/300x200/EEE/31343C?text=Beds&font=Montserrat";
const tableImageUrl = "https://placehold.co/300x200/EEE/31343C?text=Tables&font=Montserrat";
const chairImageUrl = "https://placehold.co/300x200/EEE/31343C?text=Chairs&font=Montserrat";
const deskImageUrl = "https://placehold.co/300x200/EEE/31343C?text=Desks&font=Montserrat";
const dresserImageUrl = "https://placehold.co/300x200/EEE/31343C?text=Dressers&font=Montserrat";

const modernSofaUrl = "https://placehold.co/300x200/EEE/31343C?text=Modern+Sofa&font=Montserrat";
const midCenturyBedUrl = "https://placehold.co/300x200/EEE/31343C?text=Mid-Century+Bed&font=Montserrat";
const industrialTableUrl = "https://placehold.co/300x200/EEE/31343C?text=Industrial+Table&font=Montserrat";
const ergonomicDeskUrl = "https://placehold.co/300x200/EEE/31343C?text=Ergonomic+Desk&font=Montserrat";

const modernStyleUrl = "https://placehold.co/300x200/EEE/31343C?text=Modern+Style&font=Montserrat";
const midCenturyStyleUrl = "https://placehold.co/300x200/EEE/31343C?text=Mid-Century+Style&font=Montserrat";
const industrialStyleUrl = "https://placehold.co/300x200/EEE/31343C?text=Industrial+Style&font=Montserrat";
const scandinavianStyleUrl = "https://placehold.co/300x200/EEE/31343C?text=Scandinavian+Style&font=Montserrat";

const Home = () => {
    const dispatch = useDispatch()
    const { data } = useMyDetailsQuery()
    useEffect(() => {
        if (data) {
            dispatch(addMyInfo(data))
        }
    }, [data])
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="relative w-full h-80 bg-gray-200 rounded-lg mb-8 mt-4 overflow-hidden">
                <img
                    src={heroImageUrl}
                    alt="Modern Furniture"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="text-center p-6">
                        <h1 className="text-4xl font-bold text-white mb-2">Modern Furniture</h1>
                        <p className="text-xl text-white">From classic to contemporary, find the perfect furniture for your home</p>
                    </div>
                </div>
            </div>

            {/* Featured Categories */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Featured Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col items-center">
                        <img src={sofaImageUrl} alt="Sofas" className="rounded-lg h-40 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Sofas</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={bedImageUrl} alt="Beds" className="rounded-lg h-40 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Beds</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={tableImageUrl} alt="Tables" className="rounded-lg h-40 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Tables</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={chairImageUrl} alt="Chairs" className="rounded-lg h-40 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Chairs</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={deskImageUrl} alt="Desks" className="rounded-lg h-40 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Desks</p>
                    </div>
                    <div className="hidden lg:flex lg:flex-col lg:items-center">
                        <img src={dresserImageUrl} alt="Dressers" className="rounded-lg h-40 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Dressers</p>
                    </div>
                </div>
            </div>

            {/* Trending Now */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="group cursor-pointer">
                        <img src={modernSofaUrl} alt="Modern Velvet Sofa" className="rounded-lg h-48 w-full object-cover mb-2" />
                        <h3 className="font-medium">Modern Velvet Sofa</h3>
                        <p className="text-blue-500">$100/mo</p>
                    </div>
                    <div className="group cursor-pointer">
                        <img src={midCenturyBedUrl} alt="Mid-Century Modern Bed" className="rounded-lg h-48 w-full object-cover mb-2" />
                        <h3 className="font-medium">Mid-Century Modern Bed</h3>
                        <p className="text-blue-500">$80/mo</p>
                    </div>
                    <div className="group cursor-pointer">
                         <img src={industrialTableUrl} alt="Industrial Style Coffee Table" className="rounded-lg h-48 w-full object-cover mb-2" />
                        <h3 className="font-medium">Industrial Style Coffee Table</h3>
                        <p className="text-blue-500">$50/mo</p>
                    </div>
                    <div className="group cursor-pointer">
                         <img src={ergonomicDeskUrl} alt="Ergonomic Mesh Office Desk" className="rounded-lg h-48 w-full object-cover mb-2" />
                        <h3 className="font-medium">Ergonomic Mesh Office Desk</h3>
                        <p className="text-blue-500">$30/mo</p>
                    </div>
                </div>
            </div>

            {/* Shop by Style */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Shop by Style</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="group cursor-pointer">
                        <img src={modernStyleUrl} alt="Modern Style" className="rounded-lg h-48 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Modern</p>
                    </div>
                    <div className="group cursor-pointer">
                        <img src={midCenturyStyleUrl} alt="Mid-century Style" className="rounded-lg h-48 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Mid-century</p>
                    </div>
                    <div className="group cursor-pointer">
                        <img src={industrialStyleUrl} alt="Industrial Style" className="rounded-lg h-48 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Industrial</p>
                    </div>
                    <div className="group cursor-pointer">
                        <img src={scandinavianStyleUrl} alt="Scandinavian Style" className="rounded-lg h-48 w-full object-cover mb-2" />
                        <p className="text-center font-medium">Scandinavian</p>
                    </div>
                </div>
            </div>

            {/* Join Waitlist */}
            <div className="text-center py-12 border-t border-b my-8">
                <h2 className="text-3xl font-semibold mb-2">Join our waitlist</h2>
                <p className="mb-6">Be the first to know about new arrivals, exclusive deals, and more.</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full">
                    Join now
                </button>
            </div>

            {/* Footer */}
            <footer className="py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div>About Us</div>
                    <div>Contact Us</div>
                    <div>Terms of Service</div>
                    <div>Privacy Policy</div>
                </div>
                <div className="flex justify-center space-x-4 mb-4">
                    <FiFacebook className="text-gray-500" />
                    <FiTwitter className="text-gray-500" />
                    <FiInstagram className="text-gray-500" />
                    <FiGithub className="text-gray-500" />
                </div>
                <div className="text-center text-sm text-gray-500">
                    © 2025 Rent A Chair. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
