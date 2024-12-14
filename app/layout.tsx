import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import '../styles/prism.css'
import {Inter,Space_Grotesk} from 'next/font/google'
import type { Metadata } from 'next'
export const metadata: Metadata ={
  title: 'Ask Me Anything',
  description: 'Ask Me Anything is a platform for asking questions and getting answers.',
  icons: 'public\assets\images\site-logo.svg'
}
import './globals.css'
import { ThemeProvider } from './context/ThemeProvider'
const inter=Inter({
  subsets:['latin'],
  weight:['100','200','300','400','500','600','700','800','900'],
  variable: '--font-inter'
}
);
const spaceGrotesk=Space_Grotesk({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-spaceGrotesk'
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable}`} >
        <ClerkProvider
        afterSignOutUrl={'/'}
        appearance={{
          elements:{
            formButtonPrimary:'primary-gradient',
            footerActionLink:'primary-text-gradient hover :primary-text-500',
          }
        }}
        >
          <ThemeProvider>
          
          {children}
          </ThemeProvider>
    </ClerkProvider>
        </body>
      </html>
  )
}