"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await signup(formData.email, formData.username, formData.password);
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("userId", response.user_id);
      localStorage.setItem("username", response.username);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main bento box */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border-2 border-indigo-100">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
            StudyQuest
          </h1>
          <p className="text-center text-gray-600 mb-8 font-medium">
            Level up your learning journey!
          </p>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition">
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

            {/* Username Input */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-gray-900 font-medium placeholder-gray-400"
                placeholder="your_username"
              />
            </div>

            {/* Password Input */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition">
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

            {/* Confirm Password Input */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-gray-900 font-medium placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3 rounded-2xl hover:shadow-lg transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">
              Log in here
            </Link>
          </p>
        </div>

        {/* Stats bento box */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">∞</div>
            <p className="text-sm font-semibold mt-2">Unlimited Learning</p>
          </div>
          <div className="bg-purple-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">🎮</div>
            <p className="text-sm font-semibold mt-2">Gamified XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
