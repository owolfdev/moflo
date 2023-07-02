import Link from "next/link"

import { ExpenseForm } from "@/components/form-expense"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <Link href={`/expenses`}>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Add an expense.
          </h1>
        </Link>
        <div className="pt-4">
          <ExpenseForm />
        </div>
      </div>
    </section>
  )
}
