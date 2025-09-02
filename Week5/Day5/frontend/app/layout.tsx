
import TopCallBar from '@/components/TopCallBar'
import './globals.css'
import Providers from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RootLayout({ children }:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopCallBar />
          <Navbar />
          <main className="mb-12">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
