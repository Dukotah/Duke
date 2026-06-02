import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Copper Bay Tech CRM",
  description: "Secure sign-in for the Copper Bay Tech sales CRM.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
