"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterModal({
  isOpen,
  onClose,
  switchToLogin,
}) {
  const { fetchUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const nextStep = () => {
    if (
      !form.name ||
      !form.gender ||
      !form.dob ||
      !form.phone ||
      !form.address
    ) {
      return toast.error("Please complete all fields");
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please enter email and password");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      await fetchUser();

      toast.success("Account created successfully");

      onClose();
      router.push("/");

      setForm({
        name: "",
        gender: "",
        dob: "",
        phone: "",
        address: "",
        email: "",
        password: "",
      });

      setStep(1);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="relative bg-white w-105 rounded-2xl shadow-2xl p-8">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Step {step} of 2
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {step === 1 && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <select
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500"
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <input
                type="date"
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500"
                value={form.dob}
                onChange={(e) =>
                  setForm({ ...form, dob: e.target.value })
                }
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <textarea
                placeholder="Address"
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-teal-500"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 border border-gray-300 py-2.5 rounded-lg"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Register"}
                </button>
              </div>
            </>
          )}

        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already a user?{" "}
          <button
            onClick={switchToLogin}
            className="text-teal-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}