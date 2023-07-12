"use client"

import { useEffect, useRef, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { set } from "date-fns"
import { Divide } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  email?: string
  // other properties of user...
}

export function LoginDialog() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const closeDialogRef = useRef<HTMLButtonElement>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [user])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user
        setUser(currentUser ? currentUser : null)

        if (session) {
          const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
          document.cookie = `my-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
          document.cookie = `my-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
        }

        // Navigate to the home page after sign in or sign out
        if (event === "SIGNED_IN") {
          console.log("signed in")
          router.push("/")
          router.refresh()
        } else {
          console.log("signed out")

          router.refresh()
        }
      }
    )

    // Unsubscribe when the component unmounts
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleChangeInputValue = (e: any) => {
    // if (e.target.id === "email") console.log("email:", e.target.value)
    // if (e.target.id === "password") console.log("password:", e.target.value)
    if (e.target.id === "email") setEmail(e.target.value)
    if (e.target.id === "password") setPassword(e.target.value)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/about")
    setUser(null)
  }

  const handleSignIn = async () => {
    const { user }: any = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setUser(user)
    router.push("/")
  }

  if (user)
    return (
      <div className="text-sm font-semibold hover:text-slate-800 cursor-pointer hover:bg-slate-100 sm:py-2 sm:px-3 rounded-md">
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    )

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <span className="text-sm font-semibold hover:text-slate-800 cursor-pointer hover:bg-slate-100 sm:py-2 sm:px-3 rounded-md">
            Sign In
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log In</DialogTitle>
            <DialogDescription>
              Log in to your account to continue
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                className="col-span-3"
                onChange={handleChangeInputValue}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                className="col-span-3"
                onChange={handleChangeInputValue}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              as={Button}
              action={handleSignIn}
              className={buttonVariants({
                variant: "secondary",
                size: "default",
              })}
            >
              Sign In
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

LoginDialog.displayName = "LoginDialog"
