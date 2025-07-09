import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMyDetailsQuery, useUpdateInfoMutation } from "../../Redux/Service";
import { addMyInfo } from "../../Redux/slice";
import axios from 'axios';
import { BACKEND_URL } from "../../config";
import { Link } from "react-router-dom";

export default function Settings() {
    const dispatch = useDispatch();
    const { data: myInfo, refetch } = useMyDetailsQuery();

    const { userId } = useSelector((state) => state.service);
    const [updateInfo, { isLoading, error }] = useUpdateInfoMutation();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        if (myInfo) {
            setFullName(myInfo.fullName || "");
            setPhone(myInfo.phone || "");
            setAddress(myInfo.address || "");
            setProfilePic(myInfo.profilePic || null);
        }
    }, [myInfo]);

    const handleSave = async () => {
        const updatedData = { fullName, phone, address, profilePic };

        try {
            await updateInfo({ userId, data: updatedData });
            await refetch();
            dispatch(addMyInfo(myInfo));
            console.log("Updated user info:", myInfo);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    const handleRemoveProfilePic = () => {
        setProfilePic(null);
    };

    const handleAddProfilePic = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profilePic", file);

            axios.defaults.withCredentials = true;
            axios
                .patch(BACKEND_URL + "/user/update-Profile/" + userId, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    setProfilePic(response.data.profilePic);
                })
                .catch((err) => {
                    console.error("Error uploading profile picture:", err);
                });
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">
                        Profile
                    </h1>
                </div>
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            {profilePic ? (
                                <img
                                    src={profilePic}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div>
                            )}

                            {/* Add and Remove Profile Picture buttons */}
                            <div className="absolute bottom-0 right-0 space-x-2">
                                {!profilePic && (
                                    <button
                                        onClick={() => document.getElementById('fileInput').click()}
                                        className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-white rounded-full p-2"
                                    >
                                        +
                                    </button>
                                )}

                                {profilePic && (
                                    <>
                                        <button
                                            onClick={handleRemoveProfilePic}
                                            className="bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-white rounded-full p-2"
                                        >
                                            -
                                        </button>
                                        <button
                                            onClick={() => document.getElementById('fileInput').click()}
                                            className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-white rounded-full p-2"
                                        >
                                            C
                                        </button>
                                    </>
                                )}
                            </div>

                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                onChange={handleAddProfilePic}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={myInfo?.email || ""}
                            disabled
                            className="mt-1 block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Full Name Field */}
                    <div className="space-y-1">
                        <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1">
                        <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone</label>
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Address Field */}
                    <div className="space-y-1">
                        <label htmlFor="address" className="block text-lg font-medium text-gray-700">Address</label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Password Field with Reset Button */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1 flex-1 mr-4">
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={"********"}
                                disabled
                                className="mt-1 block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <Link to={"/changePassword"}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                        >
                            Change Password
                        </Link>
                    </div>

                    {/* Save Button */}
                    <div>
                        <button
                            onClick={handleSave}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                    {/* Error Handling */}
                    {error && <div className="text-red-500 text-center mt-4">{error.message}</div>}
                </div>
            </div>
        </div>
    );
}
