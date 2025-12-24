"use client";

import { useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SUPPORTED_FORMATS = [
    { value: "png", label: "PNG Image" },
    { value: "jpg", label: "JPEG Image" },
    { value: "webp", label: "WebP Image" },
];

export default function ConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState("png");
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        setError("");

        // Check file type
        if (!file.type.startsWith("image/")) {
            setError("Mohon upload file gambar valid (JPG, PNG, WebP)");
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Ukuran file maksimal 5MB");
            return;
        }

        setFile(file);

        // Auto-select target format based on uploaded file
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext === 'png') setFormat('jpg');
        else if (ext === 'jpg' || ext === 'jpeg') setFormat('png');
        else setFormat('png');
    };

    const handleConvert = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", format);

        try {
            const response = await fetch("/api/image-convert", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal mengonversi file");
            }

            // Handle file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `unitools-converted-${file.name.split('.')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Reset after success
            setFile(null);
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
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-success mx-auto flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Image Converter</h1>
                        <p className="text-muted max-w-md mx-auto">
                            Konversi gambar antar format dengan cepat. Gambar diproses di memori, tanpa penyimpanan.
                        </p>
                    </div>

                    {/* Converter UI */}
                    <div className="glass rounded-2xl p-8 animate-fade-in delay-100">
                        {/* Upload Area */}
                        {!file ? (
                            <div
                                className={`drop-zone p-12 text-center cursor-pointer ${isDragging ? "active" : ""
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                />
                                <div className="w-16 h-16 rounded-full bg-background/50 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium mb-2">
                                    Drop file di sini atau klik untuk upload
                                </h3>
                                <p className="text-sm text-muted">
                                    Support JPG, PNG, WebP (Max 5MB)
                                </p>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="flex items-center justify-between bg-card p-4 rounded-xl mb-6 border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold">
                                            {file.name.split('.').pop()?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-medium truncate max-w-[200px]">{file.name}</h4>
                                            <p className="text-xs text-muted">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-error transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Konversi ke:</label>
                                        <select
                                            value={format}
                                            onChange={(e) => setFormat(e.target.value)}
                                            className="input-field cursor-pointer"
                                        >
                                            {SUPPORTED_FORMATS.map((fmt) => (
                                                <option key={fmt.value} value={fmt.value}>
                                                    {fmt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleConvert}
                                        disabled={isProcessing}
                                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                ⚡ Konversi & Download
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm flex items-center gap-2 animate-fade-in">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
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
