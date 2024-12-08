"use client";

import { SignIn } from "@clerk/clerk-react"
const Signin = () => {
  return (
    <main className="flex min-h-screen items-center ">
      <SignIn/>
    </main>
  )
}

export default Signin