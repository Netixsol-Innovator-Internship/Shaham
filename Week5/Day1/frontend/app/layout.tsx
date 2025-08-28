import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import SocketBridge from './_socket-bridge';
import NotificationProvider from '@/components/NotificationProvider';

export const metadata = {
  title: 'Realtime Comments (Next 15)',
  description: 'Comments with WebSockets, Followers, Notifications',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <SocketBridge />
          {children}
          <NotificationProvider />
        </Providers>
      </body>
    </html>
  )
}
