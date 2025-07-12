"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useVerifyPaymentMutation } from "@/redux/features/khalti/khaltiApi";

export default function PaymentVerifyPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const amount = params.get("amount") || "";
  const pidx = params.get("pidx") || "";
  const paymentId = params.get("purchase_order_id") || "";
  const orderName = params.get("purchase_order_name");
  const transactionId = params.get("transaction_id");

  const hasAllData = token && amount && pidx && paymentId;

  const [verifyPayment, { data, error, isLoading, isSuccess }] = useVerifyPaymentMutation();

  useEffect(() => {
    if (hasAllData) {
      verifyPayment({ token, amount, pidx, paymentId });
    }
  }, [token, amount, pidx, paymentId]);

  if (!hasAllData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-8">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
          </svg>
          <h1 className="text-3xl font-bold mb-2 text-red-700">No data provided</h1>
          <p className="text-gray-700 mb-4 text-center">Required payment verification data is missing from the URL.</p>
          <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold transition">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-8">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
          <div className="w-16 h-16 mb-4 animate-spin border-4 border-blue-200 border-t-blue-500 rounded-full" />
          <h1 className="text-2xl font-bold mb-2 text-blue-700">Verifying Payment...</h1>
          <p className="text-gray-700 mb-4 text-center">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-8">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
          </svg>
          <h1 className="text-3xl font-bold mb-2 text-red-700">Payment Verification Failed</h1>
          <p className="text-gray-700 mb-4 text-center">{error?.data?.message || "An error occurred while verifying your payment."}</p>
          <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold transition">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  if (isSuccess && data?.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-8">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
          <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="text-3xl font-bold mb-2 text-green-700">Payment Verified!</h1>
          <p className="text-gray-700 mb-4 text-center">Thank you for your payment. Your order has been placed successfully.</p>
          <div className="mb-4 text-sm text-gray-500">
            <div><span className="font-semibold">Order:</span> {orderName}</div>
            <div><span className="font-semibold">Transaction ID:</span> {transactionId}</div>
            <div><span className="font-semibold">Amount:</span> {amount && `रु ${Number(amount) / 100}`}</div>
            <div><span className="font-semibold">PIDX:</span> {pidx}</div>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/rentals" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition">View My Rentals</Link>
            <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold transition">Go to Homepage</Link>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback (should not reach here)
  return null;
} 