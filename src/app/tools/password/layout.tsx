import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Strength & Breach Checker — Free Tool | Copper Bay Tech",
  description:
    "Check your password's strength and see if it has appeared in known data breaches — without sending it anywhere. Strength analysis is instant and local; breach check uses Have I Been Pwned's k-anonymity API so your password never leaves your browser.",
  keywords:
    "password strength checker, password breach checker, have i been pwned tool, strong password test, data breach password check, password security tool, free password checker",
  alternates: { canonical: "/tools/password" },
  openGraph: {
    title: "Free Password Strength & Breach Checker | Copper Bay Tech",
    description:
      "Instantly check password strength and whether it has appeared in known breaches. Your password never leaves your browser.",
    url: "https://copperbaytech.com/tools/password",
    siteName: "Copper Bay Tech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copper Bay Tech — Password Strength & Breach Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Password Strength & Breach Checker",
    description: "Check strength and known breaches — your password never leaves your browser.",
    images: ["/og-image.png"],
  },
};

export default function PasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
