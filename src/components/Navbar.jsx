import { usePocket } from "../contexts/PocketContext";
import { Link } from "react-router";
import Button from "./Button";
import { Handshake, LogOut } from "lucide-react";

export default function Navbar() {
  let { logout, user } = usePocket();

  return (
    <nav className="flex items-center justify-between w-full p-4 bg-white shadow-sm">
      <Link to="/" className="flex items-center gap-2">
        <Handshake className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-bold text-gray-800">BuddyTask</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-6">
          <div className="font-medium text-gray-600">{user.email}</div>
          <Button
            variant="ghost"
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 font-medium text-gray-600 transition-colors rounded-md hover:cursor-pointer hover:text-blue-600 hover:bg-blue-50"
          >
            <LogOut className="w-4 h-4" />
            {/* <span>Log Out</span> */}
          </Button>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-4">
          <Link
            to="/auth/login"
            className="px-4 py-2 font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            Log In
          </Link>
          <Link
            to="/auth/signup"
            className="px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
