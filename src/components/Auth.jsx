import React, { useState } from "react";
import { usePocket } from "../contexts/PocketContext";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import Button from "./Button";

export default function Auth() {
  let navigate = useNavigate();
  const { register, login, logout, user, token, pb } = usePocket();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  let params = useParams();
  let mode = params.mode;

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        console.log(await res);
        navigate("/user"); // Navigate to user page after login
      }
      if (mode === "signup") {
        const res = await register(email, password, passwordConfirm);
        console.log(await res);
        navigate("/user"); // Navigate to user page after signup
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md p-6 mx-auto bg-white rounded-md shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        {mode === "login" ? "Log In" : "Create Account"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            className="p-2 transition-colors border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            className="p-2 transition-colors border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {mode === "signup" && (
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="passwordConfirm"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              className="p-2 transition-colors border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
            />
          </div>
        )}

        <div className="flex flex-col mt-6 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Button
            type="submit"
            variant="primary"
            className="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded sm:w-auto hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Log In"
              : "Sign Up"}
          </Button>

          <div className="text-sm text-gray-600">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              to={mode === "login" ? "/auth/signup" : "/auth/login"}
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
