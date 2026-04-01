import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const totalDoctors = await prisma.doctor.count();
  const totalPatients = await prisma.patient.count();
  const totalUsers = await prisma.user.count();
  const totalAppointments = await prisma.appointment.count();

  const confirmedAppointments = await prisma.appointment.count({
    where: { status: "CONFIRMED" },
  });

  const pendingAppointments = await prisma.appointment.count({
    where: { status: "PENDING" },
  });

  return NextResponse.json({
    totalDoctors,
    totalPatients,
    totalUsers,
    totalAppointments,
    confirmedAppointments,
    pendingAppointments,
  });
}
