"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/profile");
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="p-10 rounded-lg shadow-2xl bg-white w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {loading ? "Processing" : "Login"}
        </h1>
        <hr className="mb-6 border-gray-300" />
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
          />
        </div>
        <button
          className={`w-full p-3 font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            buttonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          onClick={onLogin}
          disabled={buttonDisabled}
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <Link href="/signup" className="text-blue-500 hover:text-blue-700">
            Don't have an account? Signup here
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password-email"
            className="text-blue-500 hover:text-blue-700"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
