import { useState } from 'react';
import { FiHome, FiHeart, FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogIn } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { myInfo } = useSelector(state => state.service);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // state to capture the search query
    const navigate = useNavigate(); // useNavigate hook for programmatic navigation

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigate(`/searchProducts?query=${encodeURIComponent(searchQuery.trim())}`); // Always redirect, even for empty query
        }
    };


    return (
        <nav className='bg-white text-gray-900 shadow-md'>
            <div className='container mx-auto flex justify-between items-center h-16 px-4'>
                {/* Logo */}
                <div className='text-xl font-bold text-[#1980E5]'>
                    <Link to='/'>Logo</Link>
                </div>

                {/* Search Bar */}
                <div className='relative w-1/3 hidden md:block'>
                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1980E5]'
                        value={searchQuery} // bind input value to state
                        onChange={(e) => setSearchQuery(e.target.value)} // update search query state
                        onKeyDown={handleSearchKeyDown} // Adding keydown event listener
                    />
                    <FiSearch className='absolute right-3 top-3 text-gray-500' size={20} />
                </div>

                {/* Navigation Links */}
                <div className='hidden md:flex items-center gap-6'>
                    <Link to='/' className='hover:text-[#1980E5]'><FiHome size={24} /></Link>
                    <Link to='/favorites' className='hover:text-[#1980E5]'><FiHeart size={24} /></Link>
                    <Link to='/cart' className='hover:text-[#1980E5]'><FiShoppingCart size={24} /></Link>

                    {/* Conditional Auth Buttons */}
                    {myInfo ? (
                        <Link to='/profile' className='flex items-center gap-2 hover:text-[#1980E5]'>
                            <FiUser size={24} />
                            <span>{myInfo.name}</span>
                        </Link>
                    ) : (
                        <Link to='/login' className='flex items-center gap-2 bg-[#1980E5] text-white px-4 py-2 rounded-lg hover:bg-blue-600'>
                            <FiLogIn size={20} /> Login/Register
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className='md:hidden text-gray-900'
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className='md:hidden bg-white text-gray-900 p-4 flex flex-col gap-4'>
                    <Link to='/' className='hover:text-[#1980E5]'><FiHome size={24} /> Home</Link>
                    <Link to='/favorites' className='hover:text-[#1980E5]'><FiHeart size={24} /> Favorites</Link>
                    <Link to='/cart' className='hover:text-[#1980E5]'><FiShoppingCart size={24} /> Cart</Link>
                    {myInfo ? (
                        <Link to='/profile' className='hover:text-[#1980E5]'><FiUser size={24} /> Profile</Link>
                    ) : (
                        <Link to='/login' className='bg-[#1980E5] text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2'>
                            <FiLogIn size={20} /> Login/Register
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
