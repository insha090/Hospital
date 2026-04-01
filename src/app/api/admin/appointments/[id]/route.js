import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });

  return NextResponse.json({ appointment });
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json({ appointment });
}
