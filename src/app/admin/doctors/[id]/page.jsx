"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import CreateDoctorModal from "@/components/modals/CreateDoctorModal";

export default function DoctorDetailPage({ params }) {

  const router = useRouter();

  const { id } = use(params);

  const [doctor, setDoctor] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const fetchDoctor = async () => {

    const res = await fetch(`/api/admin/doctors/${id}`);
    const data = await res.json();

    setDoctor(data.doctor);

  };

  useEffect(() => {
    if (id) fetchDoctor();
  }, [id]);

  if (!doctor) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading doctor...
      </div>
    );
  }

  const toggleAvailability = async () => {

    const res = await fetch(`/api/admin/doctors/${doctor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        available: !doctor.available
      })
    });

    if (res.ok) {
      toast.success("Availability updated");
      fetchDoctor();
    }

  };

  const deleteDoctor = async () => {

    const confirmDelete = confirm("Are you sure you want to delete this doctor?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/doctors/${doctor.id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      toast.success("Doctor deleted");
      router.push("/admin/doctors");
    }

  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-6">

          <img
            src={doctor.profileImage || "/doctor-placeholder.png"}
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div>

            <h1 className="text-2xl font-semibold">
              Dr. {doctor.name}
            </h1>

            <p className="text-gray-500">
              {doctor.specialization}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          {/* Availability Toggle */}

          <button
            onClick={toggleAvailability}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${doctor.available ? "bg-green-500" : "bg-gray-300"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${doctor.available ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>

          {/* Edit */}

          <button
            onClick={() => setEditOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Pencil size={18} className="text-blue-600" />
          </button>

          {/* Delete */}

          <button
            onClick={deleteDoctor}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>

        </div>

      </div>

      {/* DOCTOR INFO */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid md:grid-cols-3 gap-6 text-sm">

          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium">{doctor.gender}</p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{doctor.phone}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{doctor.user.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Degree</p>
            <p className="font-medium">{doctor.degree}</p>
          </div>

          <div>
            <p className="text-gray-500">Experience</p>
            <p className="font-medium">{doctor.experience} years</p>
          </div>

          <div>
            <p className="text-gray-500">Consultation Fees</p>
            <p className="font-medium">₹{doctor.fees}</p>
          </div>

        </div>

        {/* ABOUT */}

        <div className="mt-8 pt-6 border-t">

          <p className="text-gray-500 mb-2">About</p>

          <p className="text-sm text-gray-700 leading-relaxed">
            {doctor.about}
          </p>

        </div>

      </div>

      {/* APPOINTMENTS */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-6 border-b flex justify-between">

          <h2 className="text-xl font-semibold">
            Appointment History
          </h2>

          <span className="text-sm text-gray-500">
            {doctor.appointments?.length || 0} total
          </span>

        </div>

        {!doctor.appointments || doctor.appointments.length === 0 ? (

          <div className="p-12 text-center text-gray-500">
            No appointments for this doctor yet.
          </div>

        ) : (

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Patient</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {doctor.appointments.map((appt) => {

                const date = new Date(appt.bookingTime)
                  .toLocaleString();

                return (
                  <tr key={appt.id} className="border-b">

                    <td className="p-4">
                      {appt.patient.name}
                    </td>

                    <td>{date}</td>

                    <td>₹{appt.amount}</td>

                    <td>{appt.status}</td>

                  </tr>
                );

              })}

            </tbody>

          </table>

        )}

      </div>

      {/* EDIT MODAL */}

      <CreateDoctorModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        doctor={doctor}
        editMode
      />

    </div>
  );
}