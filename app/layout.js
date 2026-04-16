import './globals.css'
import Navbar from '@/components/Navbar'
import { LanguageProvider } from '@/lib/LanguageContext'

export const metadata = {
  title: 'Inambebar | اینم ببر',
  description: 'Connect with trusted Iranian travelers to send packages home. Fast, affordable, community-driven.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  )
}
