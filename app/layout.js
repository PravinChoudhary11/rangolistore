// app/layout.jsx
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import ClientWrapper from "./_components/ClientWrapper";

// Load Outfit from Google Fonts
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"], // Choose weights you need
  display: "swap",
});

export const metadata = {
  title: "RangoliStore",
  icons: {
    icon: "/favicon.ico", // or "/logo.png"
  },
  description: "This System is developed by OrbyteX Solutions , Founder Mr. Pravin Devaram Choudhary",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-gray-100 min-h-screen`}>
        <ClientWrapper>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
            </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
