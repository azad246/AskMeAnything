import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import {Inter,Space_Grotesk} from 'next/font/google'
import type { Metadata } from 'next'
export const metadata: Metadata ={
  title: 'Ask Me Anything',
  description: 'Ask Me Anything is a platform for asking questions and getting answers.',
  icons: 'public\assets\images\site-logo.svg'
}
import './globals.css'
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
    <ClerkProvider
    appearance={{
      elements:{
        formButtonPrimary:'primary-gradient',
        footerActionLink:'primary-text-gradient hover :primary-text-500',
      }
    }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable}`} >
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}