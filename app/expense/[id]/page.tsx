import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Expense } from "@/types/expense"
import { Button } from "@/components/ui/button"

import dataArray from "../../../data/data"

export default async function PaymentPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  console.log("params", params)

  // const expenseData = dataArray
  // const data = expenseData.find((item) => item.id === params.id)

  const formatDate = (date: string) => {
    const d: Date = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
    const formattedDate: string = d.toLocaleDateString("en-US", options)
    return formattedDate
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/about")
  }

  const { data }: any = await supabase
    .from("expenses")
    .select("*")
    .eq("id", params.id)

  const expense: Expense = data[0]

  const convertedAmount: number = expense?.amount! / 100
  const formattedAmount: string = convertedAmount.toFixed(2)
  const formattedAmountWithCommas = formattedAmount.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )
  const receiptImage = expense?.receipt as string

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10 ">
      <div className="flex items-end gap-2">
        <Link href="/expenses">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Expense
          </h1>
        </Link>
      </div>

      <div className="flex flex-col gap-2 max-w-[800px]">
        <div className="flex justify-between">
          <div>
            <div>{formatDate(expense?.created_at!)}</div>
            <div className="text-lg mb-2">
              <span className="text-lg ">&#36;</span>
              <span className="font-bold">{formattedAmountWithCommas}</span>
            </div>
          </div>
          <div className="">
            <Link href={`/expense/edit/${expense?.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-bold text-slate-600 dark:text-slate-400"
              >
                Edit
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2 overflow-hidden rounded-md border ">
          <div>
            <span className="font-bold">Description</span>
          </div>
          <div className="px-3 py-2 overflow-hidden rounded-md border mt-2 mb-4 bg-slate-100 dark:bg-slate-900">
            <div>{expense?.description}</div>
          </div>

          {/* <div className="">
            <span className="font-bold">Categories:</span> {data?.categories}
          </div> */}
          <div>
            <div className="font-bold mb-2">Categories</div>{" "}
            {/* <div className="flex gap-2 flex-wrap mb-4">
              {expense?.categories?.split(",").map((category: any) => {
                return (
                  <div className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded-md border">
                    {category}
                  </div>
                )
              })}
            </div> */}
          </div>
          <div>
            <span className="font-bold">Merchant</span> {expense?.merchant}
          </div>
          <div>
            <span className="font-bold">Location</span> {expense?.location}
          </div>
          <div>
            <span className="font-bold">Account</span> {expense?.account}
          </div>
          <div className="w-full mb-1 mt-4 border rounded-lg overflow-hidden">
            <img src={expense?.receipt as string} alt="" />
            <Image
              src={expense?.receipt as string}
              alt="receipt"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
