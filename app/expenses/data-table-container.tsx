"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useMediaQuery } from "react-responsive"

import dataArray from "../../data/data"
import { Expense, Payment, columns, columnsMobile } from "./columns"
import { DataTable } from "./data-table"

interface User {
  id: string
  email?: string
  // other properties of user...
}

function ExpensesContainer() {
  const supabase = createClientComponentClient()
  const isMobile = useMediaQuery({ maxWidth: 740 })
  // const [data, setData] = React.useState<Expense[]>([])
  const [sbData, setSbData] = useState<Expense[]>([])
  const [user, setUser] = useState<User | null>(null)

  async function getData(data: any): Promise<Expense[]> {
    const fetchedData = data
    const sortedData = fetchedData.sort((a: Expense, b: Expense) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    return [...(sortedData as Expense[])]
  }

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user
        setUser(currentUser ? currentUser : null)
      }
    )

    checkUser()

    // Cleanup function for useEffect
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase.auth])

  useEffect(() => {}, [])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("expenses").select("*")
      if (error) {
        console.error("Error fetching data:", error)
      } else {
        getData(data).then((data) => {
          setSbData(data)
        })
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    console.log("supabase data", sbData)
  }, [sbData])

  return (
    <>
      <div className="">
        <div className="max-w-[980px]">
          {isMobile ? (
            <DataTable columns={columnsMobile} data={sbData} />
          ) : (
            <DataTable columns={columns} data={sbData} />
          )}
        </div>
      </div>
    </>
  )
}

export default ExpensesContainer
