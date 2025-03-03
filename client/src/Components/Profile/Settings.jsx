import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMyDetailsQuery, useUpdateInfoMutation } from "../../Redux/Service";
import { addMyInfo } from "../../Redux/slice";
import axios from 'axios'; // Make sure to install axios or use fetch
import { BACKEND_URL } from "../../config";

export default function Settings() {
    const dispatch = useDispatch();
    const { data: myInfo, refetch } = useMyDetailsQuery(); // Fetch user details

    const { userId } = useSelector((state) => state.service);
    const [updateInfo, { isLoading, error }] = useUpdateInfoMutation();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [profilePic, setProfilePic] = useState(myInfo?.profilePic || null); // Initially set to null

    // Populate state when myInfo is available
    useEffect(() => {
        if (myInfo) {
            setFullName(myInfo.fullName || "");
            setPhone(myInfo.phone || "");
            setAddress(myInfo.address || "");
            setProfilePic(myInfo.profilePic || null); // Initialize profilePic state
        }
    }, [myInfo]);
    console.log(profilePic);
    const handleSave = async () => {
        const updatedData = { fullName, phone, address, profilePic };

        try {
            // Sending the data to the backend
            await updateInfo({ userId, data: updatedData }); // Update user info
            await refetch(); // Refetch updated user details
            dispatch(addMyInfo(myInfo)); // Update Redux state after refetch
            console.log("Updated user info:", myInfo);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    const handleRemoveProfilePic = () => {
        setProfilePic(null); // Remove the profile pic (set to null)
    };

    const handleAddProfilePic = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profilePic", file); // Send the file as binary data

            // Send the image to the backend using axios
            axios.defaults.withCredentials = true
            axios
                .patch(BACKEND_URL + "/user/update-Profile/" + userId, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",

                    },
                })
                .then((response) => {
                    setProfilePic(response.data.profilePic); // Update the profilePic state with the binary data response from the backend
                })
                .catch((err) => {
                    console.error("Error uploading profile picture:", err);
                });
        }
    };

    const handleResetPassword = () => {
        const { data } = useResetPasswordQuery();
        console.log(data);
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-50">
            <div className="w-4/5 max-w-4xl p-8 bg-white rounded-lg">
                <h1 className="text-3xl font-semibold text-center mb-6">Profile</h1>
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="relative flex justify-center items-center mb-6">
                        {profilePic ? (
                            <img
                                src={profilePic} // Convert binary data to image
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div> // Skeleton loader
                        )}

                        {/* Add and Remove Profile Picture buttons */}
                        <div className="absolute bottom-0 right-0 space-x-2">
                            {!profilePic && (
                                <button
                                    onClick={() => document.getElementById('fileInput').click()}
                                    className="bg-blue-600 text-white p-2 rounded-full"
                                >
                                    Add
                                </button>
                            )}

                            {profilePic && (
                                <>
                                    <button
                                        onClick={handleRemoveProfilePic}
                                        className="bg-red-600 text-white p-2 rounded-full"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => document.getElementById('fileInput').click()}
                                        className="bg-blue-600 text-white p-2 rounded-full"
                                    >
                                        Change
                                    </button>
                                </>
                            )}
                        </div>

                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleAddProfilePic}
                            className="hidden" // Hide the default file input
                        />
                    </div>

                    {/* Email Field */}
                    <div className="flex justify-between">
                        <label className="text-lg font-medium">Email</label>
                        <input
                            type="email"
                            value={myInfo?.email || ""}
                            disabled
                            className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md p-2 w-2/3"
                        />
                    </div>

                    {/* Full Name Field */}
                    <div className="flex justify-between">
                        <label className="text-lg font-medium">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-2/3"
                        />
                    </div>

                    {/* Phone Field */}
                    <div className="flex justify-between">
                        <label className="text-lg font-medium">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-2/3"
                        />
                    </div>

                    {/* Address Field */}
                    <div className="flex justify-between">
                        <label className="text-lg font-medium">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-2/3"
                        />
                    </div>

                    {/* Password Field with Reset Button */}
                    <div className="flex justify-between">
                        <label className="text-lg font-medium">Password</label>
                        <input
                            type="text"
                            value={"********"}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-2/3"
                        />
                        <button
                            onClick={handleResetPassword}
                            className="text-white px-6 py-2 rounded-md bg-blue-700 transition duration-300"
                        >
                            Reset Password
                        </button>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleSave}
                            className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
