import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { settings } from "@/data/settings"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { ExpenseFormAdd } from "@/components/form-add-expense"

import ExpensesContainer from "./data-table-container"

export default async function IndexPage() {
  const supabase = createServerComponentClient({ cookies })

  console.log("hello from expenses page")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("no user")
    redirect("/about")
  }

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col  gap-2 ">
        <Link href={`/`}>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Add an expense.
          </h1>
        </Link>
        <div className="pt-4">
          <ExpensesContainer />
        </div>
      </div>
    </section>
  )
}

// "use client"

// import React, { useEffect, useState } from "react"
// import Link from "next/link"
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// import { useMediaQuery } from "react-responsive"

// import dataArray from "../../data/data"
// import { Expense, Payment, columns, columnsMobile } from "./columns"
// import { DataTable } from "./data-table"

// interface User {
//   id: string
//   email?: string
//   // other properties of user...
// }

// function ExpensesPage() {
//   const supabase = createClientComponentClient()
//   const isMobile = useMediaQuery({ maxWidth: 740 })
//   const [data, setData] = React.useState<Expense[]>([])
//   const [user, setUser] = useState<User | null>(null)

//   async function getData(): Promise<Expense[]> {
//     // Fetch data from your API here.
//     // console.log("data array", dataArray)
//     const fetchedData = dataArray
//     const sortedData = fetchedData.sort((a: Expense, b: Expense) => {
//       return new Date(b.date).getTime() - new Date(a.date).getTime()
//     })
//     return [...(sortedData as Expense[])]
//   }

//   useEffect(() => {
//     const checkUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser()
//       setUser(user)
//     }

//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         const currentUser = session?.user
//         setUser(currentUser ? currentUser : null)
//       }
//     )

//     checkUser()

//     // Cleanup function for useEffect
//     return () => {
//       if (authListener && authListener.subscription) {
//         authListener.subscription.unsubscribe()
//       }
//     }
//   }, [supabase.auth])

//   useEffect(() => {
//     getData().then((data) => {
//       setData(data)
//     })
//   }, [])

//   useEffect(() => {
//     // console.log("data:", data)
//   }, [data])

//   return (
//     <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10 ">
//       <div className="flex max-w-[980px] flex-col items-start gap-2">
//         <Link href="/">
//           <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
//             Expenses
//           </h1>
//         </Link>
//       </div>
//       <div className="">
//         <div className="max-w-[980px]">
//           {isMobile ? (
//             <DataTable columns={columnsMobile} data={data} />
//           ) : (
//             <DataTable columns={columns} data={data} />
//           )}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ExpensesPage
