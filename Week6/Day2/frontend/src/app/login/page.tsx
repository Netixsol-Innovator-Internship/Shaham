"use client";
import { useState, useEffect } from "react";
import { useLoginMutation } from "@/lib/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailPrefill = searchParams.get("email") || "";
  const [form, setForm] = useState({ email: emailPrefill, password: "" });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();

      // Save to Redux
      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.accessToken,
        })
      );

      // Persist in localStorage so auth survives refresh
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      toast.success("Welcome back!");
      router.push("/");
    } catch (err: any) {
      const msg = err?.data?.message || "Login failed";
      if (typeof msg === "string" && msg.toLowerCase().includes("verify")) {
        toast.error(msg);
        router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
        return;
      }
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (emailPrefill)
      setForm((f) => ({ ...f, email: emailPrefill }));
  }, [emailPrefill]);

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center mb-6">
        Welcome Back
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Log in to continue shopping.
      </p>
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow p-6 space-y-4"
      >
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
        <button
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {isLoading ? "Signing in..." : "Log In"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        New here?{" "}
        <a href="/signup" className="underline">
          Create an account
        </a>
      </p>
    </div>
  );
}
