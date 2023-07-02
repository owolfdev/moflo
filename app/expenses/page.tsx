import React from "react"
import Link from "next/link"

const ExpensesPage = () => {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <Link href={`/`}>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Expenses
          </h1>
        </Link>
      </div>
    </section>
  )
}

export default ExpensesPage
