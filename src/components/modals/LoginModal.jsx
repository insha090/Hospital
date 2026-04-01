"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginModal({
  isOpen,
  onClose,
  switchToRegister,
}) {
  const { fetchUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      await fetchUser();

      toast.success("Logged in successfully");

      onClose();

      setEmail("");
      setPassword("");

      // ROLE BASED REDIRECT
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else if (data.user.role === "DOCTOR") {
        router.push("/doctor");
      } else {
        router.push("/");
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-white w-100 rounded-2xl shadow-2xl p-8">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <button
            onClick={switchToRegister}
            className="text-teal-600 hover:underline font-medium"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}