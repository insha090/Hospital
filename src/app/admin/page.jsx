"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  User,
  Stethoscope,
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const router = useRouter();

  const fetchStats = async () => {

    try {

      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();

      setStats(data);

    } catch {
      toast.error("Failed to load dashboard");
    }

  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return null;

  const cards = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: "bg-blue-100 text-blue-600",
      link: "/admin/doctors"
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: User,
      color: "bg-green-100 text-green-600",
      link: "/admin/users"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      link: "/admin/users"
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "bg-orange-100 text-orange-600",
      link: "/admin/appointments"
    },
    {
      title: "Confirmed Appointments",
      value: stats.confirmedAppointments,
      icon: CheckCircle,
      color: "bg-teal-100 text-teal-600",
      link: "/admin/appointments"
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700",
      link: "/admin/appointments"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      <h1 className="text-2xl font-semibold">
        Summary
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">

        {cards.map((card, index) => {

          const Icon = card.icon;

          return (
            <div
              key={index}
              onClick={() => router.push(card.link)}
              className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition flex items-center justify-between"
            >

              <div>

                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-2xl font-semibold mt-1">
                  {card.value}
                </h2>

              </div>

              <div
                className={`p-3 rounded-lg ${card.color}`}
              >
                <Icon size={24} />
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}