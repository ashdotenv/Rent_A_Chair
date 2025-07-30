"use client";
import React, { useEffect, useState } from 'react';
import { useGetMyReferralHistoryQuery, useGenerateReferralCodeMutation } from '@/redux/features/user/userApi';
import Loader from '@/components/Loader';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ReferralsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [generateCount, setGenerateCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    if (!user || user.role !== 'USER') {
      router.replace('/login');
    }
  }, [user, router]);

  const { data, isLoading, isError, error, refetch } = useGetMyReferralHistoryQuery();
  const [generateReferralCode, { isLoading: isGenerating }] = useGenerateReferralCodeMutation();

  // Assume the referral code is in data.referralCode and referrals in data.referrals
  const referralCode = data?.referralCode;
  const referrals = data?.referrals || [];

  // Only allow max 5 generations
  const canGenerate = generateCount < 5;

  const handleGenerate = async () => {
    setErrorMsg("");
    if (!canGenerate) return;
    try {
      await generateReferralCode("");
      setGenerateCount((c) => c + 1);
      refetch();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to generate referral code.");
    }
  };

  const handleCopy = async () => {
    if (!referralCode) return;
    const url = `${window.location.origin}/register?referralCode=${referralCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess("Referral link copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch {
      setCopySuccess("Failed to copy link.");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  if (!user || user.role !== 'USER') return null;
  if (isLoading) return <Loader />;
  if (isError && error && 'message' in error)
    return <div className="text-red-500">Error: {error.message || 'Failed to load referral history.'}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Referral History</h1>
      <div className="mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold">Referral Code:</span>
          <span className="text-blue-600 text-lg font-mono">{referralCode || 'Not generated yet'}</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Referral Code'}
          </button>
          {referralCode && (
            <>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded border border-gray-300 hover:bg-gray-300"
                onClick={handleCopy}
              >
                Copy Link
              </button>
              <span className="text-xs text-gray-500 break-all">/register?referralCode={referralCode}</span>
            </>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-1">You can generate a referral code up to 5 times.</div>
        {!canGenerate && <div className="text-red-500 text-sm mt-1">You have reached the maximum number of generations.</div>}
        {errorMsg && <div className="text-red-500 text-sm mt-1">{errorMsg}</div>}
        {copySuccess && <div className="text-green-600 text-sm mt-1">{copySuccess}</div>}
      </div>
      <h2 className="text-xl font-semibold mb-2">Referrals</h2>
      {referrals.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Referral Email</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral: any, idx: number) => (
              <tr key={idx}>
                <td className="py-2 px-4 border-b">{referral.email || referral.referredEmail || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{referral.status || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{referral.createdAt ? new Date(referral.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No referrals found.</div>
      )}
    </div>
  );
}
