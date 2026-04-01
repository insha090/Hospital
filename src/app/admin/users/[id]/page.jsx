import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PatientDetailPage({ params }) {

  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      user: true,
      appointments: {
        include: {
          doctor: true,
        },
        orderBy: {
          bookingTime: "desc",
        },
      },
    },
  });

  if (!patient) return notFound();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      {/* PATIENT PROFILE */}
      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              {patient.name}
            </h1>

            <p className="text-gray-500 text-sm">
              Patient Record
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Joined {new Date(patient.user.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* PROFILE GRID */}
        <div className="grid md:grid-cols-3 gap-6 text-sm">

          <div>
            <p className="text-gray-500 mb-1">Gender</p>
            <p className="font-medium">{patient.gender}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Phone</p>
            <p className="font-medium">{patient.phone}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Email</p>
            <p className="font-medium">{patient.user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Date of Birth</p>
            <p className="font-medium">
              {new Date(patient.dob).toLocaleDateString()}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-gray-500 mb-1">Address</p>
            <p className="font-medium">{patient.address}</p>
          </div>

        </div>

      </div>

      {/* APPOINTMENTS */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Appointment History
          </h2>

          <span className="text-sm text-gray-500">
            {patient.appointments.length} total
          </span>
        </div>

        {patient.appointments.length === 0 ? (

          <div className="p-12 text-center text-gray-500">
            No appointments booked yet.
          </div>

        ) : (

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Doctor</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {patient.appointments.map((appt) => {

                const date = new Date(appt.bookingTime)
                  .toLocaleString();

                return (
                  <tr key={appt.id} className="border-b hover:bg-gray-50">

                    <td className="p-4 font-medium">
                      Dr. {appt.doctor.name}
                    </td>

                    <td>{date}</td>

                    <td>₹{appt.amount}</td>

                    <td>

                      <span className={`px-2 py-1 text-xs rounded-full
                        ${appt.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : appt.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-700"
                            : appt.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}>

                        {appt.status}

                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}