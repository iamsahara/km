import type { Metadata, Viewport } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import { KitchenStateProvider } from "@/components/kitchen-state-provider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kitchryn Hub",
  description:
    "Interactive kitchen management dashboard with tasks, reminders, and inventory watch.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${spaceGrotesk.variable} antialiased`}>
        <KitchenStateProvider>{children}</KitchenStateProvider>
      </body>
    </html>
  );
}
