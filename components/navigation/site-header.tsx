"use client"

import { use, useEffect, useState } from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { set } from "date-fns"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AuthAvatar } from "@/components/navigation/auth-avatar"
import { LoginDialog } from "@/components/navigation/login-dialog"
import { MainNav } from "@/components/navigation/main-nav"

interface User {
  id: string
  email?: string
  // other properties of user...
}

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (
        !user ||
        !["oliverwolfson@gmail.com", "owolfdev@gmail.com"].includes(
          user.email as string
        )
      ) {
        // Redirect the user to the login page if they are not logged in or their email is not allowed
        await supabase.auth.signOut()
        router.push("/about")
        setUser(null)
        return null
      }

      setUser(user)
    }

    fetchUser()
  }, [])

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

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/about")
  //   }
  // }, [user])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
            {!user && <LoginDialog />}
            {user && (
              <>
                <Link href={"/"}>
                  <button
                    disabled={!user}
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    <Icons.add className="w-5 h-5" />
                    <span className="sr-only">Add Expense</span>
                  </button>
                </Link>
                <Link href={"/settings"}>
                  <button
                    disabled={!user}
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    <Icons.settings className="w-5 h-5" />
                    <span className="sr-only">Settings</span>
                  </button>
                </Link>
                <Link href={"/analytics"}>
                  <button
                    disabled={!user}
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    <Icons.chart className="w-5 h-5" />
                    <span className="sr-only">Stats</span>
                  </button>
                </Link>
              </>
            )}
            <Link href={"/docs"}>
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.docs className="w-5 h-5" />
                <span className="sr-only">Documentation</span>
              </div>
            </Link>

            <AuthAvatar />
          </nav>
        </div>
      </div>
    </header>
  )
}
