"use client"

import { useEffect, useState } from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AuthAvatar } from "@/components/navigation/auth-avatar"
import { MainNav } from "@/components/navigation/main-nav"

interface User {
  id: string
  email?: string
  // other properties of user...
}

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  // if (!user) {
  //   redirect("/about")
  // }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
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
