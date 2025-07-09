import React from "react";
import { MdCheckCircle } from "react-icons/md"; // Importing from react-icons
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D141C] text-white px-4">
      <div className="bg-[#1980E5] p-6 rounded-2xl shadow-lg text-center">
        <MdCheckCircle size={80} className="text-white mx-auto mb-4" /> {/* Using the MdCheckCircle icon */}
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-lg mb-4">Thank you for your purchase. Your transaction has been completed.</p>
        <button
          className="mt-4 px-6 py-2 bg-white text-[#1980E5] font-semibold rounded-lg hover:bg-gray-200 transition"
          onClick={() => navigate("/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
