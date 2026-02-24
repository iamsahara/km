import type { Metadata } from "next";
import { KitchenStateProvider } from "@/components/kitchen-state-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "KM App",
  description: "Kitchen workflow portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <KitchenStateProvider>{children}</KitchenStateProvider>
      </body>
    </html>
  );
}
