// src/app/api/upload/image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Tipo de arquivo não suportado. Use apenas JPG ou PNG.",
        },
        { status: 400 }
      );
    }

    // Validate file size (1MB max)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "Arquivo muito grande. Tamanho máximo: 1MB.",
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.split(".")[0];
    const extension = file.name.split(".").pop();
    const filename = `${user.id}/${timestamp}-${originalName}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      data: {
        url: blob.url,
        filename: blob.pathname,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor ao fazer upload da imagem",
      },
      { status: 500 }
    );
  }
}
