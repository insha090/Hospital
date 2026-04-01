"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAppointmentsPage() {

  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  const fetchAppointments = async () => {

    const res = await fetch("/api/admin/appointments");
    const data = await res.json();

    setAppointments(data.appointments || []);

  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusStyle = (status) => {

    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }

  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Appointments
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {appointments.map((appt) => {

              const date = new Date(appt.bookingTime).toLocaleString();

              return (
                <tr
                  key={appt.id}
                  onClick={() => router.push(`/admin/appointments/${appt.id}`)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >

                  <td className="p-4">{appt.patient.name}</td>

                  <td>{appt.doctor.name}</td>

                  <td>{date}</td>

                  <td>₹{appt.amount}</td>

                  <td>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(appt.status)}`}
                    >
                      {appt.status}
                    </span>
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