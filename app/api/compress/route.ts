import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const qualityStr = formData.get("quality") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const quality = parseInt(qualityStr || "70", 10);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let sharpInstance = sharp(buffer);
        let outputBuffer: Buffer;
        let contentType = file.type;

        // Determine format and apply compression
        const metadata = await sharpInstance.metadata();
        const format = metadata.format;

        if (format === 'jpeg' || format === 'jpg') {
            outputBuffer = await sharpInstance.jpeg({ quality, mozjpeg: true }).toBuffer();
        } else if (format === 'png') {
            // PNG compression is different, quality maps to colors/compression level
            outputBuffer = await sharpInstance.png({
                quality: quality,
                compressionLevel: 9,
                palette: true
            }).toBuffer();
        } else if (format === 'webp') {
            outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
        } else {
            // Fallback: just convert to jpeg if unknown or unsupported for direct compression
            outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
            contentType = "image/jpeg";
        }

        return new NextResponse(outputBuffer as any, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="compressed.${format || 'jpg'}"`,
            },
        });

    } catch (error) {
        console.error("Compression Error:", error);
        return NextResponse.json(
            { error: "Gagal memproses kompresi gambar." },
            { status: 500 }
        );
    }
}
