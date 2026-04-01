import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.patient.findMany({
    include: {
      user: true,
      appointments: true,
    },
    orderBy: {
      user: {
        createdAt: "desc",
      },
    },
  });

  return NextResponse.json({ users });
}
