"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import dataArray from "@/data/data"
import { settings } from "@/data/settings"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { ExpenseFormEdit } from "@/components/form-edit-expense"

interface Expense {
  id: string
  date: string
  user_id: string
  amount: number
  description: string
  location: string
  account: string
  categories: string
  currency: string
  merchant: string
  receipt: string
  author: string
}

interface Expense {
  id: string
  date: string
  user_id: string
  amount: number
  description: string
  location: string
  account: string
  categories: string
  currency: string
  merchant: string
  receipt: string
  author: string
}

export default function EditExpensePage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [expense, setExpense] = useState<Expense>({
    id: "",
    date: "",
    user_id: "",
    amount: 0,
    description: "",
    location: "",
    account: "",
    categories: "",
    currency: "",
    merchant: "",
    receipt: "",
    author: "",
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchExpense = async () => {
      const { data }: any = await supabase
        .from("expenses")
        .select("*")
        .eq("id", params.id)
        .single()

      setExpense(data)
    }
    fetchExpense()
  }, [])

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col  gap-2">
        <Link href={`/expense/${params.id}`}>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Edit Expense.
          </h1>
        </Link>
        <div className="pt-4">
          <ExpenseFormEdit settings={settings} expense={expense} />
        </div>
      </div>
    </section>
  )
}
