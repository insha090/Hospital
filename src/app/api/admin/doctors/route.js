import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  const formData = await req.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const gender = formData.get("gender");
  const degree = formData.get("degree");
  const specialization = formData.get("specialization");
  const experience = formData.get("experience");
  const fees = formData.get("fees");
  const about = formData.get("about");
  const phone = formData.get("phone");
  const available = formData.get("available") === "true";
  const imageFile = formData.get("image");

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "doctors" }, (err, result) => {
          if (err) reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    imageUrl = upload.secure_url;
  }

  const password = Math.random().toString(36).slice(-8);
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: "DOCTOR",

      doctor: {
        create: {
          name,
          gender,
          degree,
          specialization,
          experience: Number(experience),
          fees: Number(fees),
          about,
          phone,
          available,
          profileImage: imageUrl,
        },
      },
    },
  });

  return NextResponse.json({
    message: "Doctor created",
    credentials: {
      email,
      password,
    },
  });
}
export async function GET() {
  const doctors = await prisma.doctor.findMany();

  return NextResponse.json({ doctors });
}
