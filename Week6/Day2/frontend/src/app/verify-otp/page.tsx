"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useVerifyOTPMutation, useResendOTPMutation } from "@/lib/api";
import toast from "react-hot-toast";

export default function VerifyOtpPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailParam = searchParams.get("email") || "";
    const [email, setEmail] = useState(emailParam);
    const [otp, setOtp] = useState("");
    const [verifyOtp, { isLoading }] = useVerifyOTPMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOTPMutation();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await verifyOtp({ email, otp }).unwrap();
            toast.success("Email verified. You can now log in.");
            router.push("/login");
        } catch (err: any) {
            toast.error(err?.data?.message || "Invalid or expired OTP");
        }
    };

    const onResend = async () => {
        try {
            await resendOtp({ email }).unwrap();
            toast.success("OTP resent. Check your email.");
        } catch (err: any) {
            toast.error(err?.data?.message || "Unable to resend OTP yet");
        }
    };

    return (
        <div className="max-w-md mx-auto px-6 py-10">
            <h1 className="text-3xl font-extrabold text-center mb-6">Verify Email</h1>
            <p className="text-center text-gray-500 mb-8">Enter the OTP sent to your email address.</p>
            <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">OTP</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 tracking-widest"
                        placeholder="••••••"
                        required
                    />
                </div>
                <button disabled={isLoading} className="w-full bg-black text-white py-3 rounded-lg">
                    {isLoading ? "Verifying..." : "Verify"}
                </button>
                <button type="button" onClick={onResend} disabled={isResending} className="w-full border border-black py-3 rounded-lg">
                    {isResending ? "Resending..." : "Resend OTP"}
                </button>
            </form>
        </div>
    );
}


