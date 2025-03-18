import React from "react";
import { Handshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function Marketing() {
  return (
    <div className="flex flex-col items-center max-w-3xl px-4 py-12 mx-auto space-y-10">
      {/* <div className="flex items-center gap-3">
        <Handshake className="w-12 h-12 text-blue-600 md:w-16 md:h-16" />
      </div> */}

      <h1 className="px-4 text-3xl font-bold text-center text-gray-800 md:text-4xl lg:text-5xl">
        Win More. Together.
      </h1>

      <p className="max-w-xl px-4 text-lg text-center text-gray-600 md:text-xl">
        BuddyTask empowers you to achieve your goals with the support of a
        friend.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-4 mt-8 sm:flex-row sm:max-w-md sm:justify-center">
        <Link
          to="/auth/login"
          className="w-full px-6 py-3 font-medium text-center text-gray-600 transition-colors border border-gray-300 rounded-md hover:text-blue-600 hover:bg-gray-50"
        >
          Log In
        </Link>
        <Link
          to="/auth/signup"
          className="w-full px-6 py-3 font-medium text-center text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
