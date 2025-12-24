"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

function generateShortCode(length: number = 5): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function isValidUrl(url: string): { valid: boolean; error?: string } {
    try {
        const parsed = new URL(url);
        const blockedSchemes = ['javascript:', 'data:', 'vbscript:', 'file:'];
        if (blockedSchemes.some(scheme => url.toLowerCase().startsWith(scheme))) {
            return { valid: false, error: 'URL scheme tidak diizinkan' };
        }
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return { valid: false, error: 'Hanya HTTP dan HTTPS yang diizinkan' };
        }
        return { valid: true };
    } catch {
        return { valid: false, error: 'Format URL tidak valid' };
    }
}

export default function ShortenerPage() {
    const [inputUrl, setInputUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setError("");
        setShortUrl("");
        setCopied(false);

        if (!inputUrl.trim()) {
            setError("Silakan masukkan URL");
            return;
        }

        const validation = isValidUrl(inputUrl.trim());
        if (!validation.valid) {
            setError(validation.error || "URL tidak valid");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Generate unique code
            let code = generateShortCode();
            const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

            // 2. Insert to Supabase (retry once if collision, though rare for demo)
            const { error: insertError } = await supabase
                .from('links')
                .insert([{ original_url: inputUrl.trim(), short_code: code }]);

            if (insertError) {
                // Simple retry logic for collision
                if (insertError.code === "23505") { // unique violation
                    code = generateShortCode();
                    const { error: retryError } = await supabase
                        .from('links')
                        .insert([{ original_url: inputUrl.trim(), short_code: code }]);

                    if (retryError) throw retryError;
                } else {
                    throw insertError;
                }
            }

            setShortUrl(`${baseUrl}/u/${code}`);

        } catch (err: any) {
            console.error(err);
            setError("Gagal membuat short link. Pastikan database sudah disetup.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = shortUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col gradient-bg">
            <Header />

            <main className="flex-1 pt-24">
                <section className="max-w-3xl mx-auto px-6 py-20">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">URL Shortener</h1>
                        <p className="text-muted max-w-xl mx-auto">
                            Pendekkan link panjang menjadi lebih ringkas dan mudah dibagikan.
                        </p>
                    </div>

                    <div className="glass rounded-2xl p-8 animate-fade-in delay-100">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">URL Tujuan</label>
                                <input
                                    type="url"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    placeholder="https://example.com/very-long-url"
                                    className="input-field"
                                />
                            </div>

                            {error && (
                                <div className="text-error text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                {isLoading ? "Memproses..." : "🔗 Generate Short URL"}
                            </button>
                        </div>

                        {shortUrl && (
                            <div className="mt-8 pt-8 border-t border-border animate-fade-in">
                                <label className="block text-sm font-medium mb-2 text-success">
                                    ✓ Berhasil!
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shortUrl}
                                        readOnly
                                        className="input-field flex-1 bg-primary/10 border-primary/30"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className={`px-6 rounded-xl font-medium transition-all ${copied
                                            ? "bg-primary/40 text-primary hover:bg-primary/50"
                                            : "bg-primary/20 text-primary hover:bg-primary/30"
                                            }`}
                                    >
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
