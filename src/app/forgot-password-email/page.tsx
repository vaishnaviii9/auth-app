"use client";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

export default function ForgotPasswordEmail() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async () => {
    try {
      setLoading(true)
        const res = await axios.post("/api/users/forgotpasswordemail",{email})
        setMessage(res.data.message || "Reset link sent successfully!");

    } catch (error:any) {
        setMessage(error.response?.data?.error || "Something went wrong.");
    }
    finally{
      setLoading(true)
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {loading ? "Processing": "Reset password"}
        </h1>
        <hr className="mb-6 border-gray-300" />
      <label htmlFor="email" className="p-2">
        Enter your Email
      </label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Send Reset Link
      </button>
      {message ? message : ""}
    </div>
  );
}
