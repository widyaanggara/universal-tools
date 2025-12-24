import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              100% All-in-One Web Tools
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Universal Tools Web
              <br />
              <span className="gradient-text">Cepat & Privat</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
              Shorten URL, konversi gambar, dan kompres gambar langsung dari browser tanpa perlu aplikasi tambahan.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shortener" className="btn-primary text-lg px-8 py-4 rounded-xl">
                🔗 URL Shortener
              </Link>
              <Link href="/compressor" className="btn-secondary text-lg px-8 py-4 rounded-xl">
                ⚡ Compress Gambar
              </Link>
            </div>
          </div>
        </section>

        {/* Tools Showcase */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Pilih Tool Anda
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* URL Shortener Card */}
            <Link href="/shortener" className="group">
              <div className="glass rounded-2xl p-8 card-hover h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  URL Shortener
                </h3>
                <p className="text-muted text-sm">
                  Persingkat URL panjang menjadi link yang mudah dibagikan.
                </p>
              </div>
            </Link>

            {/* Image Converter Card */}
            <Link href="/image-converter" className="group">
              <div className="glass rounded-2xl p-8 card-hover h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-success flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                  Image Converter
                </h3>
                <p className="text-muted text-sm">
                  Konversi gambar antar format (PNG, JPG, WebP) dengan cepat dan instan.
                </p>
              </div>
            </Link>

            {/* Image Compressor Card */}
            <Link href="/compressor" className="group">
              <div className="glass rounded-2xl p-8 card-hover h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-500 transition-colors">
                  Image Compressor
                </h3>
                <p className="text-muted text-sm">
                  Kurangi ukuran file gambar JPG/PNG/WebP dengan kualitas tetap terjaga.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-border/50">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🚀", title: "Super Cepat", desc: "Langsung proses tanpa antrian" },
              { icon: "🔒", title: "100% Privat", desc: "File langsung dihapus" },
              { icon: "♾️", title: "Tanpa Batas", desc: "Bebas pakai sepuasnya" },
              { icon: "🌐", title: "Serverless", desc: "Running on Edge" },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass rounded-xl p-6 text-center animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
