import { Manrope, Inter, Space_Grotesk } from "next/font/google";
import Splash from "@/components/Splash";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://moderncatering.example"),
  title: "Modern Catering | Taste the Celebration",
  description:
    "Premium event catering in Thrissur, Kerala. Weddings, live counters, buffets and full event management since 1997. Taste the Celebration.",
  icons: { icon: "/images/logo.png" },
  openGraph: {
    title: "Modern Catering | Taste the Celebration",
    description:
      "Premium event catering in Thrissur, Kerala since 1997. Weddings, live counters, buffets & full event management.",
    images: ["/images/s304.jpg"],
  },
};

export const viewport = {
  themeColor: "#101a30",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Splash />
        {children}
      </body>
    </html>
  );
}
