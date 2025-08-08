"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Profile</h1>
        <hr className="my-4" />
        <p className="text-center text-gray-600">Welcome to your profile page</p>
        <div className="p-4 mt-6 text-center bg-green-100 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">
            {data === "nothing" ? (
              "Nothing to see here"
            ) : (
              <Link href={`/profile/${data}`} className="text-green-500 hover:text-green-700">
                {data}
              </Link>
            )}
          </h2>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col space-y-4">
          <button
            onClick={logout}
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Logout
          </button>
          <button
            onClick={getUserDetails}
            className="px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Get User Details
          </button>
        </div>
      </div>
    </div>
  );
}
