import './styles/globals.css';

export const metadata = {
  title: 'Realtime Comments',
  description: 'Next.js + Socket.IO demo'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
