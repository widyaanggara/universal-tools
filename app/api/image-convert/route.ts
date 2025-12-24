import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const format = formData.get("format") as string;

        if (!file) {
            return NextResponse.json(
                { error: "Tidak ada file yang diunggah" },
                { status: 400 }
            );
        }

        if (!format || !["png", "jpg", "webp"].includes(format)) {
            return NextResponse.json(
                { error: "Format output tidak valid" },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process image with Sharp
        let sharpInstance = sharp(buffer);
        let outputBuffer: Buffer;
        let contentType: string;

        switch (format) {
            case "png":
                outputBuffer = await sharpInstance.png().toBuffer();
                contentType = "image/png";
                break;
            case "jpg":
                outputBuffer = await sharpInstance.jpeg({ quality: 90 }).toBuffer();
                contentType = "image/jpeg";
                break;
            case "webp":
                outputBuffer = await sharpInstance.webp({ quality: 90 }).toBuffer();
                contentType = "image/webp";
                break;
            default:
                return NextResponse.json(
                    { error: "Format tidak didukung" },
                    { status: 400 }
                );
        }

        // Return the processed file
        return new NextResponse(outputBuffer as any, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="converted.${format}"`,
            },
        });

    } catch (error) {
        console.error("Conversion error:", error);
        return NextResponse.json(
            { error: "Gagal memproses gambar. Pastikan file tidak rusak." },
            { status: 500 }
        );
    }
}
