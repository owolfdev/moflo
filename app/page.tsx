import Link from "next/link"
import { settings } from "@/data/settings"

import { ExpenseForm } from "@/components/form-add-expense"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col  gap-2 ">
        <Link href={`/expenses`}>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Add an expense.
          </h1>
        </Link>
        <div className="pt-4">
          <ExpenseForm settings={settings} />
        </div>
      </div>
    </section>
  )
}
