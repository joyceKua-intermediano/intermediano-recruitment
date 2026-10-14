import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from './Provider'
import { LoadingProvider } from '@/components/ui/loading-provider'
import { Toaster } from '@/components/ui/sonner'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/navbar'
import Script from 'next/script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'INTERMEDIANO - Global Talent Platform | Intermediano Recruitment',
  description: 'INTERMEDIANO - Global Talent Platform connecting global talent to opportunities without borders. Intermediano Recruitment offers access to main global employers with speed, convenience and safety.',
  keywords: 'INTERMEDIANO, Global Talent Platform, Intermediano Recruitment, global talent, remote work, freelancing, professional platform, international opportunities, job recruitment, talent acquisition',
  authors: [{ name: 'INTERMEDIANO Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/site.webmanifest',

  openGraph: {
    title: 'INTERMEDIANO - Global Talent Platform | Intermediano Recruitment',
    description: 'INTERMEDIANO - Global Talent Platform connecting global talent to opportunities without borders. Intermediano Recruitment offers access to main global employers with speed, convenience and safety.',
    type: 'website',
    locale: 'en_US',
    url: 'https://recruitment.intermediano.com',
    siteName: 'INTERMEDIANO - Global Talent Platform',
  },
  twitter: {
    card: 'summary',
    title: 'INTERMEDIANO - Global Talent Platform',
    description: 'Connecting global talent to opportunities without borders. Access the main global employers with more speed, convenience and safety.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="_lmYT3aqeaMRh8EkxuZOOPtakzhUsf3vZALI0DI3EoE" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#7c2a1c" />
        <meta name="theme-color" content="#7c2a1c" />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "INTERMEDIANO - Global Talent Platform",
              "alternateName": "Intermediano Recruitment",
              "url": "https://recruitment.intermediano.com",
              "logo": "https://recruitment.intermediano.com/logo.png",
              "description": "INTERMEDIANO - Global Talent Platform connecting global talent to opportunities without borders. Intermediano Recruitment offers access to main global employers with speed, convenience and safety.",
              "sameAs": [
                "https://www.linkedin.com/company/intermediano-inc",
                "https://twitter.com/intermediano",
                "https://www.facebook.com/profile.php?id=61557440275159"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://recruitment.intermediano.com/contact"
              },
              "serviceType": "Recruitment Services",
              "areaServed": "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Job Opportunities",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Global Talent Recruitment"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <LoadingProvider>
            <div className='flex flex-col min-h-screen'>
              <Navbar />
              <main className='flex-1'>
                {children}
              </main>
              <Footer />
            </div>
            <Toaster 
              position='top-center' 
              richColors
              closeButton
              duration={4000}
            />
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  )
}
