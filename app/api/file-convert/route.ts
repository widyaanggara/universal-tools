import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const format = formData.get("format") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Simulasi delay processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // NOTE: Real implementation requires heavy binaries (LibreOffice) not supported in Vercel Serverless.
        // This is a placeholder that returns the original file content 
        // but with the requested new extension to demonstrate the flow.

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer as any, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="converted.${format}"`,
            },
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Server error handling conversion request" },
            { status: 500 }
        );
    }
}
