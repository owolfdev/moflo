"use client"

import React, { useEffect, useState } from "react"
import { fetchExpensesForMonthYear } from "@/utils/supabase"
import {
  Bar,
  BarChart,
  Cell,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

interface DataItem {
  name: string
  total: number
  color: string
}

export function ReChartBarForMonthOverview() {
  const [dataForChart, setDataForChart] = useState<DataItem[]>([])

  // Get the current month and year
  const date = new Date()
  const currentYear = date.getFullYear()
  // Add 1 to getMonth() because months are 0-based in JavaScript
  const currentMonth = date.getMonth() + 1

  // Function to convert date to Month YYYY string
  const dateToMonthYearString = (date: Date) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  useEffect(() => {
    // get data for month / year
    async function fetchExpensesForMonth() {
      const expenses = await fetchExpensesForMonthYear(
        currentYear,
        currentMonth
      )
      setDataForChart(aggregateExpenses(expenses))
    }

    fetchExpensesForMonth()
  }, [])

  const aggregateExpenses = (expenses: any) => {
    const categoryExpenses: { [key: string]: number } = {}

    expenses.forEach((expense: any) => {
      const categories = expense.categories.split(",")
      categories.forEach((category: string) => {
        // Remove quotation marks
        category = category.replace(/"/g, "")
        // Limit to 20 characters
        if (category.length > 8) {
          category = category.substring(0, 8) + "..."
        }

        if (!categoryExpenses[category]) categoryExpenses[category] = 0
        categoryExpenses[category] += expense.amount
      })
    })

    return Object.entries(categoryExpenses).map(([name, total]) => ({
      name,
      total: total / 100000,
      color: "#66CC00",
    }))
  }

  return (
    <>
      <h2>{dateToMonthYearString(date)}</h2>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart layout="vertical" data={dataForChart}>
          <XAxis
            type="number"
            stroke="#888888"
            fontSize={12}
            angle={-45}
            height={25}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `฿${value}k`}
          />
          <YAxis
            width={90}
            interval={0}
            type="category"
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={(props) => {
              const { x, y, payload } = props
              return (
                <text
                  x={x - 10}
                  y={y}
                  dy={5}
                  textAnchor="end"
                  fill="#888888"
                  fontSize={14}
                >
                  {payload.value}
                </text>
              )
            }}
          />
          <Bar dataKey="total" barSize={40}>
            {dataForChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="total"
              position="insideLeft"
              style={{ fill: "#fff" }}
              formatter={(value: any) => `฿${parseInt(value)}k`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}
