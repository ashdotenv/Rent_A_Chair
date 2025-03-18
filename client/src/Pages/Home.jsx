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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <h1 className="text-4xl font-bold text-white mb-2">Modern Furniture</h1>
            <p className="text-xl text-white">From classic to contemporary, find the perfect furniture for your home</p>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['Sofas', 'Beds', 'Tables', 'Chairs', 'Desks', 'Dressers'].map((category, index) => (
            <div key={index} className={`${index === 5 ? 'hidden lg:block' : ''}`}>
              <div className="bg-gray-200 rounded-lg h-40 mb-2 animate-pulse"></div>
              <p className="text-center font-medium">{category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Modern Velvet Sofa', price: '$100/mo' },
            { name: 'Mid-Century Modern Bed', price: '$80/mo' },
            { name: 'Industrial Style Coffee Table', price: '$50/mo' },
            { name: 'Ergonomic Mesh Office Desk', price: '$30/mo' }
          ].map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gray-200 rounded-lg h-48 mb-2 animate-pulse"></div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-blue-500">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shop by Style */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Shop by Style</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Modern', 'Mid-century', 'Industrial', 'Scandinavian'].map((style, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gray-200 rounded-lg h-48 mb-2 animate-pulse"></div>
              <p className="text-center font-medium">{style}</p>
            </div>
          ))}
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