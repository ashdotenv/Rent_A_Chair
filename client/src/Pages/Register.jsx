import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../Redux/Service/Service";
import toast from "react-hot-toast";
const Register = () => {
    const [register, { isError, isLoading }] = useRegisterMutation()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const obj = Object.fromEntries(formData.entries());
        const data = await register(obj)
        console.log(data);
        if (data.error) {
            toast.error(data.error.data.message)
        } else if (data.data.message) {
            toast.success(data.data.message)
        }
    };
    useEffect(() => {
        if (isError) {
            toast.error("Something Went Wrong")
        }
    }, [register])

    const [agreeToTermsAndCondition, setAgreeToTermsAndCondition] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex bg-white shadow-md rounded-lg overflow-hidden">
                {/* Left Section: Form */}
                <div className="w-full max-w-md p-8">
                    <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Full Name"
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center">
                                <input
                                    onClick={() => setAgreeToTermsAndCondition((prev) => !prev)}
                                    type="checkbox"
                                    id="terms"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                    I agree to the Terms of Service and Privacy Policy.
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${agreeToTermsAndCondition ? "hover:bg-blue-700 cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                            disabled={!agreeToTermsAndCondition}
                        >
                            Create account
                        </button>
                        <div className="mt-2">
                            Already Have an account? <Link className="text-blue-500" to="/login">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
