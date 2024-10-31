import { SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Theme from './Theme'
import MobileNavbar from './MobileNavbar'
import GlobalSearch from '../Search/GlobalSearch'

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1">
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900">
          AskMe<span className="text-primary-500">Anything</span>
        </p>
      </Link>
        <GlobalSearch/>
        <div className='flex-between gap-5'>
            <Theme/>
            <SignedIn>
            <UserButton appearance={{
                    elements:{
                        avatarBox:'h-10 w-10'
                    }
                    
                }
            } />
            </SignedIn>
            <MobileNavbar/>
        </div>
    </nav>
  )
}

export default Navbar