import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../Redux/Service";
import toast from "react-hot-toast";
import { addMyInfo, toggleLoginStatus } from "../Redux/slice";
import { useSelector, useDispatch } from "react-redux";
const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [login, loginData] = useLoginMutation()
    const { loggedInStatus } = useSelector(state => state.service)
    if (loggedInStatus) {
        navigate("/profile")
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const obj = Object.fromEntries(formData.entries());
        const data = await login(obj)
        console.log(obj);
        if (data.error) {
            toast.error(data.error.data.message)
        } else if (data.data.message) {
            toast.success(data.data.message)
            dispatch(addMyInfo(data.data.user))
            dispatch(toggleLoginStatus(true))
        }
    };

    return (
        <div
            className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden"
            style={{
                '--checkbox-tick-svg':
                    "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(248,250,252)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')",
                fontFamily: 'Manrope, "Noto Sans", sans-serif',
            }}
        >
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-8 md:px-40 flex flex-1 justify-center py-5">
                    <form onSubmit={handleSubmit} className="layout-content-container flex flex-col w-full max-w-[512px] py-5">
                        {/* Image Section */}
                        <div className="w-full">
                            <div
                                className="rounded-xl px-4 py-3 bg-center bg-cover bg-no-repeat min-h-[218px]"
                                style={{
                                    backgroundImage:
                                        "url('https://cdn.usegalileo.ai/sdxl10/0cfc4fdc-264b-4e64-8aa9-f12fd44a815b.png')",
                                }}
                            ></div>
                        </div>

                        {/* Title */}
                        <h1 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center py-5">
                            Login
                        </h1>

                        {/* Email Input */}
                        <div className="flex max-w-full flex-wrap items-end gap-4 px-4 py-3">
                            <label htmlFor="email" className="flex flex-col min-w-40 flex-1">
                                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Email address</p>
                                <input
                                    id="email"
                                    name="email"
                                    placeholder="Email address"
                                    className="form-input w-full resize-none rounded-xl bg-[#e7edf3] h-14 p-4 text-[#0e141b] placeholder:text-[#4e7397] focus:outline-0 focus:ring-0"
                                    required
                                />
                            </label>
                        </div>

                        {/* Password Input */}
                        <div className="flex max-w-full flex-wrap items-end gap-4 px-4 py-3">
                            <label htmlFor="password" className="flex flex-col min-w-40 flex-1">
                                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Password</p>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="form-input w-full resize-none rounded-xl bg-[#e7edf3] h-14 p-4 text-[#0e141b] placeholder:text-[#4e7397] focus:outline-0 focus:ring-0"
                                    required
                                />
                            </label>
                        </div>

                        {/* Remember Me */}
                        <div className="px-4">
                            <label className="flex items-center gap-3 py-3">
                                <input
                                onClick={(e)=>toggleRememberMe()}
                                    type="checkbox"
                                    name="rememberMe"
                                    className="h-5 w-5 rounded border-2 border-[#d0dbe7] bg-transparent checked:bg-[#1980e6] focus:ring-0"
                                />
                                <p className="text-[#0e141b] text-base font-normal">Remember me</p>
                            </label>
                        </div>

                        {/* Forgot Password */}
                        <p className="text-[#4e7397] text-sm font-normal leading-normal px-4 underline cursor-pointer">
                            Forgot password?
                        </p>

                        {/* Submit Button */}
                        <div className="flex px-4 py-3">
                            <button
                                type="submit"
                                className="w-full h-10 flex items-center justify-center rounded-xl bg-[#1980e6] text-slate-50 text-sm font-bold"
                            >
                                Sign in
                            </button>
                        </div>

                        {/* Register Redirect */}
                        <div className="mt-2 text-center">
                            Don't have an account yet?{' '}
                            <Link to="/register" className="text-blue-500">
                                Register
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};


export default Login;
