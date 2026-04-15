import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Inambebar | اینم ببر',
  description: 'Send packages home with trusted Iranian travelers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
