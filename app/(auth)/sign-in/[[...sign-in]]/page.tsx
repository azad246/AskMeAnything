"use client";

import { SignIn } from "@clerk/clerk-react"
const Signin = () => {
  return (
    <main className="flex min-h-screen min-w-full items-center justify-center">
      <SignIn/>
    </main>
  )
}

export default Signin