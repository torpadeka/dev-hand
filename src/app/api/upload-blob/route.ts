import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const filename = formData.get("filename") as string;

  if (!file || !filename) {
    return NextResponse.json({ error: "Missing file or filename" }, { status: 400 });
  }

  try {
    const { url } = await put(`certificates/${Date.now()}-${filename}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
