"use client";
import { useState } from "react";
import { useRegisterMutation, useResendOTPMutation } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [register, { isLoading }] = useRegisterMutation();
    const [resendOtp] = useResendOTPMutation();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(form).unwrap();
            // Optionally trigger initial OTP send (backend likely already sends on register)
            try { await resendOtp({ email: form.email }).unwrap(); } catch { }
            toast.success("Signup successful. Check your email for the OTP.");
            router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
        } catch (err: any) {
            toast.error(err?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="max-w-md mx-auto px-6 py-10">
            <h1 className="text-3xl font-extrabold text-center mb-6">Create Account</h1>
            <p className="text-center text-gray-500 mb-8">Join and start earning loyalty points.</p>
            <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>
                <button disabled={isLoading} className="w-full bg-black text-white py-3 rounded-lg">
                    {isLoading ? "Creating..." : "Sign Up"}
                </button>
            </form>
            <p className="text-center text-sm mt-4">
                Already have an account? <a href="/login" className="underline">Log in</a>
            </p>
        </div>
    );
}


