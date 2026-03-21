import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Creando Derecho Consultores | Asesoría Legal Sector Público Chile",
  description:
    "Consultoría legal especializada en Derecho Administrativo, Gestión Municipal y Ley Karin. Defensa de funcionarios públicos y asesoría estratégica a organismos estatales en Chile.",
  keywords: [
    "derecho administrativo",
    "ley karin chile",
    "sumario administrativo",
    "defensa funcionarios públicos",
    "consultoría legal sector público",
    "gestión municipal",
    "creando derecho",
  ],
  authors: [{ name: "Creando Derecho Consultores" }],
  openGraph: {
    title: "Creando Derecho Consultores | Asesoría Legal Sector Público Chile",
    description:
      "Consultoría legal especializada en Derecho Administrativo, Gestión Municipal y Ley Karin.",
    url: "https://www.creandoderecho.cl",
    siteName: "Creando Derecho Consultores",
    locale: "es_CL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              name: "Creando Derecho Consultores",
              description:
                "Consultoría legal especializada en Derecho Administrativo, Gestión Municipal y Ley Karin.",
              url: "https://www.creandoderecho.cl",
              email: "contacto@creandoderecho.cl",
              areaServed: {
                "@type": "Country",
                name: "Chile",
              },
              serviceType: [
                "Derecho Administrativo",
                "Gestión Municipal",
                "Ley Karin",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50">
        {children}
      </body>
    </html>
  );
}
