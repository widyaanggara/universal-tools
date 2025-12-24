"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/shortener", label: "URL Shortener" },
    { href: "/image-converter", label: "Image Converter" },
    { href: "/compressor", label: "Image Compress" },
];

export default function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-white font-bold text-xl">U</span>
                    </div>
                    <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                        Unitools
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${pathname === item.href
                                ? "bg-primary/20 text-primary"
                                : "text-muted hover:text-foreground hover:bg-white/5"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass border-t border-white/10 p-4">
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg transition-all ${pathname === item.href
                                    ? "bg-primary/20 text-primary"
                                    : "text-muted hover:text-foreground hover:bg-white/5"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
