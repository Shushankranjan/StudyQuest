"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("userId", response.user_id);
      localStorage.setItem("username", response.username);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main bento box */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border-2 border-emerald-100">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
            StudyQuest
          </h1>
          <p className="text-center text-gray-600 mb-8 font-medium">
            Welcome back, Scholar!
          </p>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:border-emerald-300 transition">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-gray-900 font-medium placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:border-emerald-300 transition">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-gray-900 font-medium placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-2xl hover:shadow-lg transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center mt-6 text-gray-600 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
              Sign up now
            </Link>
          </p>
        </div>

        {/* Stats bento box */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">📚</div>
            <p className="text-sm font-semibold mt-2">Learn Together</p>
          </div>
          <div className="bg-yellow-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">⭐</div>
            <p className="text-sm font-semibold mt-2">Earn Rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
