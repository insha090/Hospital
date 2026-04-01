"use client";

import { useRouter } from "next/navigation";

export default function DoctorCard({ doctor }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/admin/doctors/${doctor.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
    >

      {/* Image */}
      <div className="h-48 bg-gray-100">
        <img
          src={doctor.profileImage || "/doctor-placeholder.png"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">

        <h3 className="font-semibold text-lg">
          {doctor.name}
        </h3>

        <p className="text-sm text-gray-600">
          {doctor.specialization}
        </p>

        <div className="flex justify-between text-sm text-gray-500">

          <span>
            {doctor.experience} yrs exp
          </span>

          <span className="font-medium text-teal-600">
            ₹{doctor.fees}
          </span>

        </div>

        <div>
          {doctor.available ? (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Available
            </span>
          ) : (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
              Unavailable
            </span>
          )}
        </div>

      </div>
    </div>
  );
}