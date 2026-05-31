import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="bg-[#FAFAF9] min-h-screen flex flex-col">
        <section className="flex-1 flex items-center justify-center pt-32 pb-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Big 404 */}
            <p
              className="text-[120px] md:text-[180px] font-bold leading-none mb-4 select-none"
              style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              404
            </p>

            {/* Headline */}
            <h1
              className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
              style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
            >
              Page not found
            </h1>

            {/* Sub-message */}
            <p
              className="text-base md:text-lg mb-10 max-w-md mx-auto"
              style={{ color: "#3F3F46", fontFamily: "var(--font-body)", opacity: 0.65 }}
            >
              Sorry, the page you&apos;re looking for doesn&apos;t exist or may have been moved.
              Let&apos;s get you back on track.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Go Home
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold transition-colors border"
                style={{
                  color: "#18181B",
                  borderColor: "rgba(24,24,27,0.2)",
                  backgroundColor: "white",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Get in Touch
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold transition-colors"
                style={{
                  color: "#3F3F46",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Resources &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
