import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AirportStatusWidget from '@/components/AirportStatusWidget'
import { LanguageProvider } from '@/lib/LanguageContext'

export const metadata = {
  metadataBase: new URL('https://www.inambebar.com'),
  title: 'Inambebar | اینم ببر',
  description: 'Connect with trusted Iranian travelers to send packages home. Fast, affordable, community-driven.',
  openGraph: {
    title: 'Inambebar | اینم ببر',
    description: 'Send anything home with the people you trust. Peer-to-peer package delivery for the Iranian diaspora.',
    url: 'https://www.inambebar.com',
    siteName: 'Inambebar',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inambebar | اینم ببر',
    description: 'Send anything home with the people you trust.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <Navbar />
          <AirportStatusWidget />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
