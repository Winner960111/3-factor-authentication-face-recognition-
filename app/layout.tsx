
import '@/app/globals.css'

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'StockBot',
    template: `%s - StockBot`
  },
  description:
    'Lightning Fast AI Chatbot that Responds With Live Interactive Stock Charts, Financials, News, Screeners, and More.',

}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (

      <html lang="en" suppressHydrationWarning>
        <body>

          <div className="flex flex-col min-h-screen justify-between">

            <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
          </div>
        </body>
      </html>

  )
}
