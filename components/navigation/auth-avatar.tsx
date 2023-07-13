"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { set } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  email?: string
  // other properties of user...
}

interface Profile {
  id: string
  first_name: string
  last_name: string
  avatar: string
  // other properties of profile...
}

export function AuthAvatar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // console.log("profile: ", profile)
  }, [profile])

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // console.log("user: ", user)

      if (user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        } else {
          console.error("Failed to fetch profile:", error)
        }
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(null)
        setProfile(null)
        checkUser()
      }
    )

    // checkUser()

    // Cleanup function for useEffect
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase.auth])

  return (
    <>
      {user?.email && profile?.avatar && (
        <Link href="/profile">
          <div className=" pl-2">
            <Avatar>
              <AvatarImage
                src={profile?.avatar}
                alt={`${profile?.first_name} ${profile?.last_name}`}
              />
              <AvatarFallback>OW</AvatarFallback>
            </Avatar>
          </div>
        </Link>
      )}
    </>
  )
}
