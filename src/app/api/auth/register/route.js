import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, gender, dob, phone, address, email, password } =
      await req.json();

    if (!name || !gender || !dob || !phone || !address || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "PATIENT",
        patient: {
          create: {
            name,
            gender,
            dob: new Date(dob),
            phone,
            address,
          },
        },
      },
      include: {
        patient: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "365d" },
    );

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.json({
      message: "Registered & logged in",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        patient: user.patient,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
