import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

// Next.js Route Handler
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string }> } // Type for Next.js 15
) {
    try {
        // Handle both Next.js 15 (Promise) and 14 (Object) params
        // 'await' works on non-promises too, so this is safe for 14.
        const params = await context.params;
        const code = params?.code;

        console.log("--> [REDIRECT] Request for code:", code);

        if (!code) {
            return NextResponse.redirect(new URL("/shortener", request.url));
        }

        // 1. Direct Database Query
        const { data, error } = await supabase
            .from('links')
            .select('original_url')
            .eq('short_code', code)
            .single();

        if (error || !data) {
            console.error("--> [REDIRECT] Supabase Error or Not Found:", error);

            // Return friendly 404 page
            return new NextResponse(
                `<html>
           <head><title>Link Not Found</title></head>
           <body style="font-family:sans-serif; text-align:center; padding:50px; background:#111; color:#fff;">
             <h1>Link Tidak Ditemukan</h1>
             <p>Kode: ${code}</p>
             <p style="color:red; font-size:12px;">Debug: ${error?.message || "Data null"}</p>
             <a href="/" style="color:cyan;">Kembali ke Home</a>
           </body>
         </html>`,
                { status: 404, headers: { "Content-Type": "text/html" } }
            );
        }

        // 2. Success Redirect
        console.log("--> [REDIRECT] Success! Redirecting to:", data.original_url);

        // Ensure URL has protocol
        let targetUrl = data.original_url;
        if (!targetUrl.startsWith("http")) {
            targetUrl = "https://" + targetUrl;
        }

        return NextResponse.redirect(targetUrl, {
            status: 301,
        });

    } catch (err: any) {
        console.error("--> [REDIRECT] Server Error:", err);
        return new NextResponse(`Server Error: ${err.message}`, { status: 500 });
    }
}
