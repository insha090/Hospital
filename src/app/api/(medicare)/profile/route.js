import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const patient = await prisma.patient.findUnique({
    where: { userId: decoded.id },
    include: { user: true },
  });

  return NextResponse.json({
    profile: {
      name: patient.name,
      email: patient.user.email,
      phone: patient.phone,
      dob: patient.dob,
      gender: patient.gender,
      address: patient.address,
    },
  });
}

export async function PATCH(req) {
  try {
    const body = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updated = await prisma.patient.update({
      where: {
        userId: decoded.id,
      },
      data: {
        name: body.name,
        phone: body.phone,
        gender: body.gender,
        address: body.address,
        dob: new Date(body.dob),
      },
    });

    return NextResponse.json({
      message: "Profile updated",
      patient: updated,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
