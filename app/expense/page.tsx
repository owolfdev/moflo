import React from "react"

import { ExpenseLookupForm } from "@/components/form-expense-lookup"

const ExpenseLookupPage = () => {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Expense Lookup
        </h1>
        <p className="text-lg text-gray-600">
          Enter the unique id for the expense you want to view.
        </p>
        <div className="flex w-full gap-2 mt-4">
          <ExpenseLookupForm />
        </div>
      </div>
    </section>
  )
}

export default ExpenseLookupPage
