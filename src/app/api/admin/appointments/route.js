import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ appointments });
}
