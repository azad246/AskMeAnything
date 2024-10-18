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
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
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