"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"

function SignOutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/about")
  }

  return <Button onClick={handleSignOut}>Sign Out</Button>
}

export default SignOutButton
