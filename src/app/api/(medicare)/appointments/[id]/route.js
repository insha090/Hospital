import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PATCH(req, { params }) {
  const { id } = params;

  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointment) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const patient = await prisma.patient.findUnique({
    where: { userId: decoded.id },
  });

  if (!patient) {
    return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  }

  if (appointment.patientId !== patient.id) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ appointment: updated });
}
