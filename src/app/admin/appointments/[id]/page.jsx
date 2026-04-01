"use client";

import { useEffect, useState, use } from "react";
import toast from "react-hot-toast";

export default function AppointmentDetailPage({ params }) {

  const { id } = use(params);

  const [appointment, setAppointment] = useState(null);

  const fetchAppointment = async () => {

    const res = await fetch(`/api/admin/appointments/${id}`);
    const data = await res.json();

    setAppointment(data.appointment);

  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const updateStatus = async (status) => {

    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      toast.success("Status updated");
      fetchAppointment();
    }

  };

  if (!appointment) return null;

  const date = new Date(appointment.bookingTime).toLocaleString();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h1 className="text-xl font-semibold">
        Appointment Details
      </h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-3 text-sm">

        <div>
          <b>Patient:</b> {appointment.patient.name}
        </div>

        <div>
          <b>Doctor:</b> Dr. {appointment.doctor.name}
        </div>

        <div>
          <b>Date:</b> {date}
        </div>

        <div>
          <b>Amount:</b> ₹{appointment.amount}
        </div>

        <div>
          <b>Status:</b> {appointment.status}
        </div>

      </div>

      {/* Status Controls */}

      <div className="bg-white rounded-xl shadow p-6 space-y-3">

        <h2 className="font-semibold">
          Update Status
        </h2>

        <div className="flex gap-3">

          <button
            onClick={() => updateStatus("CONFIRMED")}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Confirm
          </button>

          <button
            onClick={() => updateStatus("CANCELLED")}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => updateStatus("COMPLETED")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Complete
          </button>

        </div>

      </div>

    </div>
  );
}