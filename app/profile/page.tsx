import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/navigation/login-dialog"
import SignOutButton from "@/components/sign-out-button"

const ProfilePage = async () => {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null

  if (user) {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileData) {
      profile = profileData
    } else {
      console.error("Failed to fetch profile:", error)
    }
  }

  // if (!user) {
  //   redirect("/unauth")
  // }

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Profile
        </h1>
        <div className="flex flex-col gap-2 text-lg text-muted-foreground">
          <div>Name: {`${profile?.first_name} ${profile?.last_name}`}</div>
          <div>Email: {user?.email}</div>
        </div>

        <div className="">
          {/* <LoginDialog /> */}
          <SignOutButton />
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
