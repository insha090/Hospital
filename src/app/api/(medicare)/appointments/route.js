import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const body = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const patient = await prisma.patient.findUnique({
    where: {
      userId: decoded.id,
    },
  });

  if (!patient) {
    return NextResponse.json(
      { message: "Patient profile not found" },
      { status: 404 },
    );
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: body.doctorId,
      bookingTime: new Date(body.bookingTime),
      amount: 500,
    },
  });

  return NextResponse.json({ appointment });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const patient = await prisma.patient.findUnique({
    where: { userId: decoded.id },
  });

  if (!patient) {
    return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: { doctor: true },
    orderBy: { bookingTime: "desc" },
  });

  return NextResponse.json({ appointments });
}
