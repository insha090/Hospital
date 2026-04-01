"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {

  const [users, setUsers] = useState([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Patients
        </h1>

        <span className="text-sm text-gray-500">
          {users.length} total
        </span>

      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border">

        <table className="w-full text-left">

          <thead className="bg-gray-50 border-b text-sm text-gray-600">
            <tr>
              <th className="p-4 font-semibold">Patient</th>
              <th className="font-semibold">Gender</th>
              <th className="font-semibold">Phone</th>
              <th className="font-semibold">Email</th>
              <th className="font-semibold">Appointments</th>
              <th className="font-semibold">Joined</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => {

              const joined = new Date(user.user.createdAt)
                .toLocaleDateString();

              return (
                <tr
                  key={user.id}
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >

                  <td className="p-4 font-medium text-gray-800">
                    {user.name}
                  </td>

                  <td className="text-gray-600">
                    {user.gender}
                  </td>

                  <td className="text-gray-600">
                    {user.phone}
                  </td>

                  <td className="text-gray-600">
                    {user.user.email}
                  </td>

                  <td className="text-gray-600">
                    {user.appointments.length}
                  </td>

                  <td className="text-gray-600">
                    {joined}
                  </td>

                  <td className="pr-4 text-right text-gray-400">
                    <ChevronRight size={18} />
                  </td>

                </tr>
              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}