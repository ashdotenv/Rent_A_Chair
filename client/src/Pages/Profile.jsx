import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMyDetailsQuery, useUpdateInfoMutation } from "../Redux/Service";
import { addMyInfo } from "../Redux/slice";

export default function Profile() {
    const dispatch = useDispatch();
    const { data: myInfo, refetch } = useMyDetailsQuery(); // Fetch user details properly

    const { userId } = useSelector((state) => state.service);
    const [updateInfo, { isLoading, error }] = useUpdateInfoMutation();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // Populate state when myInfo is available
    useEffect(() => {
        if (myInfo) {
            setFullName(myInfo.fullName || "");
            setPhone(myInfo.phone || "");
            setAddress(myInfo.address || "");
        }
    }, [myInfo]);

    const handleSave = async () => {
        const updatedData = { fullName, phone, address };

        try {
            await updateInfo({ userId, data: updatedData }); // Update user info

            await refetch(); // Refetch updated user details

            dispatch(addMyInfo(myInfo)); // Update Redux state after refetch

            console.log("Updated user info:", myInfo);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    return (
        <div className="max-w-4xl h-screen mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-center mb-6">Profile</h1>
            <div className="space-y-6">
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
    );
}
