import React from 'react';

const PaymentFailure = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-2xl font-semibold text-blue-500 text-center mb-6">Payment Failed</h3>
                <p className="text-gray-700 text-center mb-4">
                    There was an issue with your payment. Please try again or contact support if the issue persists.
                </p>
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                        If the issue persists, you can{' '}
                        <a href="mailto:support@example.com" className="text-blue-500 hover:text-blue-700">
                            contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
