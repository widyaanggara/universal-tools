import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo & Description */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-white font-bold">U</span>
                        </div>
                        <span className="text-muted text-sm">
                            Unitools © {new Date().getFullYear()} • Tools Online Cepat dan Simpel
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted">
                        <Link href="/shortener" className="hover:text-foreground transition-colors">
                            URL Shortener
                        </Link>
                        <Link href="/image-converter" className="hover:text-foreground transition-colors">
                            Image Converter
                        </Link>
                        <Link href="/compressor" className="hover:text-foreground transition-colors">
                            Image Compressor
                        </Link>
                    </div>
                </div>

                {/* Bottom note */}
                <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
                    <p>Solusi tools online cepat dan praktis.</p>
                </div>
            </div>
        </footer>
    );
}
