import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { settings } from "@/data/settings"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { ExpenseFormAdd } from "@/components/form-add-expense"

export default async function IndexPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col  gap-2 ">
        <Link href={`/expenses`}>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Add an expense.
          </h1>
        </Link>
        <div className="pt-4">
          <div>Welcome {user.email}</div>
          <ExpenseFormAdd settings={settings} />
        </div>
      </div>
    </section>
  )
}
