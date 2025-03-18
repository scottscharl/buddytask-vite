import { usePocket } from "../contexts/PocketContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { Handshake, LogOut, User } from "lucide-react";

export default function Navbar() {
  let { logout, user } = usePocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Navigate to home/marketing page after logout
  };

  return (
    <nav className="flex items-center justify-between w-full p-4 bg-white shadow-sm">
      {/* Logo links to different places based on auth state */}
      <Link to={user ? "/user" : "/"} className="flex items-center gap-2">
        <Handshake className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-bold text-gray-800">BuddyTask</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="items-center hidden font-medium text-gray-600 sm:flex">
            {user.email}
          </div>
          <div className="flex sm:hidden">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 font-medium text-gray-600 transition-colors rounded-md hover:text-blue-600 hover:bg-blue-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
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
