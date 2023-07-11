import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

const ProfilePage = async () => {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect("/unauth")
  // }
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Profile
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          This is the profile page.
        </p>
        <div>Welcome {user?.email}</div>
      </div>
    </section>
  )
}

export default ProfilePage
