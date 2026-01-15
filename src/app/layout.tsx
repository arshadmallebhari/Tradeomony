import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Tradeomony - B2B Export-Import Marketplace",
    description: "Connect with verified exporters and importers across India. Streamline your international trade with our trusted B2B marketplace.",
    keywords: ["export", "import", "B2B", "marketplace", "trade", "India", "international trade"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
