"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  email?: string
  // other properties of user...
}

export function AuthAvatar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user
        setUser(currentUser ? currentUser : null)
      }
    )

    checkUser()

    // Cleanup function for useEffect
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase.auth])

  return (
    user && (
      <Link href="/profile">
        <div className=" pl-2">
          <Avatar>
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/108033355"
              alt="@owolfdev"
            />
            <AvatarFallback>OW</AvatarFallback>
          </Avatar>
        </div>
      </Link>
    )
  )
}
