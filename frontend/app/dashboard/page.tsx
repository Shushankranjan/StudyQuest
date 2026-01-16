"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Redirect to login if no token
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const userData = await getUser(parseInt(userId));
        setUser(userData);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-xl font-bold text-gray-900">Loading your quest...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
          <p className="text-red-600 font-bold text-lg mb-4">{error || "User not found"}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-2xl hover:bg-red-600 transition"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">
            StudyQuest Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-2xl hover:bg-red-600 transform hover:scale-105 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {user.username}! 🎮
          </h2>
          <p className="text-lg font-medium opacity-90">
            Let's start your learning adventure today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* XP Card */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 font-semibold">Total XP</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {user.total_xp}
                </p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${Math.min((user.total_xp / 1000) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {1000 - user.total_xp} XP to next level
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-semibold">Email</p>
                <p className="text-lg font-bold text-gray-900 mt-2 break-all">
                  {user.email}
                </p>
              </div>
              <div className="text-4xl">📧</div>
            </div>
          </div>

          {/* Level Card */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-pink-200 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-semibold">Level</p>
                <p className="text-4xl font-bold text-pink-600 mt-2">
                  {Math.floor(user.total_xp / 1000) + 1}
                </p>
              </div>
              <div className="text-4xl">🚀</div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            🎯 Your Quest Awaits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300 hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-blue-900 mb-2">
                Study Sessions
              </h4>
              <p className="text-blue-700">
                Coming soon: Create and track your study sessions
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-300 hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-green-900 mb-2">
                Achievements
              </h4>
              <p className="text-green-700">
                Coming soon: Unlock badges and achievements
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-300 hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-orange-900 mb-2">
                Leaderboard
              </h4>
              <p className="text-orange-700">
                Coming soon: Compete with other learners
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border-2 border-pink-300 hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-pink-900 mb-2">
                Rewards Store
              </h4>
              <p className="text-pink-700">
                Coming soon: Spend your XP on rewards
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
