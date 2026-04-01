"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronRight } from "lucide-react";
import CreateDoctorModal from "@/components/modals/CreateDoctorModal";
import toast from "react-hot-toast";

export default function AdminDoctorsPage() {

  const [doctors, setDoctors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/admin/doctors");
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Doctors
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          <Plus size={18} />
          Add Doctor
        </button>

      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border">

        <table className="w-full text-left">

          <thead className="bg-gray-50 border-b text-sm text-gray-600">
            <tr>
              <th className="p-4">Doctor</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Fees</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {doctors.map((doc) => (

              <tr
                key={doc.id}
                onClick={() => router.push(`/admin/doctors/${doc.id}`)}
                className="border-b hover:bg-gray-50 cursor-pointer transition"
              >

                {/* Doctor */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={doc.profileImage || "/doctor-placeholder.png"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="font-medium text-gray-800">
                    {doc.name}
                  </div>
                </td>
                <td className="text-gray-600">
                  {doc.specialization}
                </td>
                <td className="text-gray-600">
                  {doc.experience} yrs
                </td>
                <td className="text-gray-600">
                  ₹{doc.fees}
                </td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded-full
                    ${doc.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                    {doc.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="pr-4 text-right text-gray-400">
                  <ChevronRight size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateDoctorModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        refreshDoctors={fetchDoctors}
      />
    </div>
  );
}