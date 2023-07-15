"use client"

import { log } from "console"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useMediaQuery } from "react-responsive"

import { Expense } from "@/types/expense"
import { Button } from "@/components/ui/button"

function TextEditPage() {
  const supabase = createClientComponentClient()
  const [sbData, setSbData] = useState<Expense[]>([])

  const fetchData = async () => {
    const { data, error } = await supabase.from("expenses").select("*")
    if (error) {
      console.error("Error fetching data:", error)
    } else {
      console.log("data", data)

      setSbData(data)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getData = async () => {
    fetchData()
  }

  const updateData = async () => {
    sbData.map((expense) => {
      const input = expense.categories
      const output = input.replace(/{|}/g, "")
      console.log(`category for ${expense.id}: ${output}`)

      const updateCategory = async () => {
        try {
          // Update the category in the Supabase table
          const { error } = await supabase
            .from("expenses")
            .update({ categories: output })
            .match({ id: expense.id })

          if (error) {
            console.error(`Error updating category for ${expense.id}:`, error)
          } else {
            console.log(`Category updated successfully for ${expense.id}`)
          }
        } catch (error) {
          console.error(`Error updating category for ${expense.id}:`, error)
        }
      }

      updateCategory()

      //
    })
  }

  return (
    <div>
      <Button onClick={getData}>Get Data</Button>
      <Button onClick={updateData}>Update Data</Button>
      <div>
        {sbData.map((expense) => {
          return <div key={expense.id}>{expense.categories}</div>
        })}
      </div>
    </div>
  )
}

export default TextEditPage

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

// function ExpensesContainer() {
//   const supabase = createClientComponentClient()
//   const isMobile = useMediaQuery({ maxWidth: 740 })
//   // const [data, setData] = React.useState<Expense[]>([])
//   const [sbData, setSbData] = useState<Expense[]>([])
//   const [user, setUser] = useState<User | null>(null)

//   async function getData(data: any): Promise<Expense[]> {
//     const fetchedData = data
//     const sortedData = fetchedData.sort((a: Expense, b: Expense) => {
//       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

//   useEffect(() => {}, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data, error } = await supabase
//         .from("expenses_for_app")
//         .select("*")
//       if (error) {
//         console.error("Error fetching data:", error)
//       } else {
//         getData(data).then((data) => {
//           setSbData(data)
//         })
//       }
//     }

//     fetchData()
//   }, [])

//   useEffect(() => {
//     console.log("supabase data", sbData)
//   }, [sbData])

//   return (
//     <>
//       <div className="">
//         <div className="max-w-[980px]">
//           {isMobile ? (
//             <DataTable columns={columnsMobile} data={sbData} />
//           ) : (
//             <DataTable columns={columns} data={sbData} />
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default ExpensesContainer
