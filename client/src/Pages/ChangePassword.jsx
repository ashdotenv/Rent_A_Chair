import React, { useState } from 'react';
import { useChangePasswordMutation } from '../Redux/Service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [previousPassword, setPreviousPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [changePassword, changePasswordData] = useChangePasswordMutation()
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await changePassword({ previousPassword: previousPassword, newPassword: newPassword })
        console.log(data);
        if (data.error) {
            toast.error(data.error.data.message)
        } else if (data.data.message) {
            toast.success(data.data.message)
            navigate("/")
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Previous Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={previousPassword}
                            onChange={(e) => setPreviousPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;