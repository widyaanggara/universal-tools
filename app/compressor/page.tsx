"use client";

import { useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const QUALITY_OPTIONS = [
    { value: "90", label: "High (90%) - Sedikit Kompresi" },
    { value: "70", label: "Medium (70%) - Rekomendasi" },
    { value: "50", label: "Low (50%) - Kompresi Tinggi" },
    { value: "30", label: "Extreme (30%) - Ukuran Minimum" },
];

export default function CompressorPage() {
    const [file, setFile] = useState<File | null>(null);
    const [quality, setQuality] = useState("70");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.type.startsWith("image/")) {
                setError("Mohon upload file gambar valid");
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("Ukuran file maksimal 10MB");
                return;
            }
            setFile(selectedFile);
            setError("");
        }
    };

    const handleCompress = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("quality", quality);

        try {
            const response = await fetch("/api/compress", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal mengompresi gambar");
            }

            // Handle download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            // Append "-compressed" before extension
            const nameParts = file.name.split('.');
            const ext = nameParts.pop();
            const name = nameParts.join('.');
            a.download = `${name}-compressed.${ext}`;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Optional: Reset or show success
            // setFile(null); 
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col gradient-bg">
            <Header />
            <main className="flex-1 pt-24">
                <section className="max-w-3xl mx-auto px-6 py-20">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mx-auto flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Image Compressor</h1>
                        <p className="text-muted">
                            Kurangi ukuran file gambar JPG, PNG, WebP untuk menghemat penyimpanan.
                        </p>
                    </div>

                    <div className="glass rounded-2xl p-8 animate-fade-in delay-100">
                        {!file ? (
                            <div
                                className="drop-zone p-12 text-center cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept="image/png,image/jpeg,image/webp"
                                />
                                <div className="text-4xl mb-4">🖼️</div>
                                <h3 className="text-lg font-medium mb-2">Klik atau Drop gambar di sini</h3>
                                <p className="text-sm text-muted">JPG, PNG, WebP (Max 10MB)</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="flex items-center justify-between bg-card p-4 rounded-xl mb-6 border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                                            I
                                        </div>
                                        <div>
                                            <h4 className="font-medium truncate max-w-[200px]">{file.name}</h4>
                                            <p className="text-xs text-muted">
                                                Original: {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-error transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-3">Tingkat Kualitas:</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {QUALITY_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setQuality(opt.value)}
                                                    className={`p-3 rounded-xl border text-sm transition-all ${quality === opt.value
                                                            ? "border-primary bg-primary/10 text-primary"
                                                            : "border-border hover:border-border/80 bg-card"
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCompress}
                                        disabled={isProcessing}
                                        className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            "⚡ Compress Gambar Sekarang"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-center text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
