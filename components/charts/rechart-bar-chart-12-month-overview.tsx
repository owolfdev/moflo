"use client"

import React, { use, useEffect, useState } from "react"
import { fetchExpensesForTheLast12Months } from "@/utils/supabase"
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

interface DataItem {
  name: string
  total: number
  color: string
}

export function ReChartBarFor12MonthOverview() {
  const [dataForChart, setDataForChart] = useState<DataItem[]>([])

  useEffect(() => {
    async function fetchExpensesForYear() {
      const expenses = await fetchExpensesForTheLast12Months()
      setDataForChart(aggregateExpenses(expenses))
    }
    fetchExpensesForYear()
  }, [])

  const aggregateExpenses = (expenses: any) => {
    const monthlyExpenses = Array(12).fill(0)

    expenses.forEach((expense: any) => {
      const month = new Date(expense.date).getMonth()
      monthlyExpenses[month] += expense.amount
    })

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    return monthlyExpenses.map((total, index) => ({
      name: months[index],
      total: total / 100000,
      color: index === new Date().getMonth() ? "#ff6347" : "#66CC00", // New color selection code
    }))
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={450}>
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
            width={60}
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
          <Bar dataKey="total">
            {dataForChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} /> // Colors are now coming from the data object
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

// import React, { use, useEffect, useState } from "react"
// import { fetchExpensesForTheLast12Months } from "@/utils/supabase"
// import {
//   Bar,
//   BarChart,
//   Cell,
//   LabelList,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
// } from "recharts"

// interface DataItem {
//   name: string
//   total: number
//   color: string
// }

// export function ReChartBar() {
//   const [dataForChart, setDataForChart] = useState<DataItem[]>([])
//   //fetch the expenses for the previous 12 months
//   useEffect(() => {
//     async function fetchExpensesForYear() {
//       const expenses = await fetchExpensesForTheLast12Months()
//       console.log("expenses: ", expenses)
//       setDataForChart(aggregateExpenses(expenses))
//     }
//     fetchExpensesForYear()
//   }, [])

//   useEffect(() => {
//     console.log("dataForChart: ", dataForChart)
//   }, [dataForChart])

//   const aggregateExpenses = (expenses: any) => {
//     const monthlyExpenses = Array(12).fill(0)

//     expenses.forEach((expense: any) => {
//       const month = new Date(expense.date).getMonth()
//       monthlyExpenses[month] += expense.amount
//     })

//     const months = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ]

//     return monthlyExpenses.map((total, index) => ({
//       name: months[index],
//       total: total / 100000,
//       color: "#adfa1d",
//     }))
//   }

//   return (
//     <>
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart layout="vertical" data={dataForChart}>
//           <XAxis
//             type="number"
//             stroke="#888888"
//             fontSize={12}
//             angle={-45}
//             height={25}
//             tickLine={false}
//             axisLine={false}
//             tickFormatter={(value) => `฿${value}k`}
//           />
//           <YAxis
//             width={40}
//             interval={0}
//             type="category"
//             dataKey="name"
//             stroke="#888888"
//             fontSize={12}
//             tickLine={false}
//             axisLine={false}
//             tick={(props) => {
//               const { x, y, payload } = props
//               return (
//                 <text
//                   x={x - 10}
//                   y={y}
//                   dy={5}
//                   textAnchor="end"
//                   fill="#888888"
//                   fontSize={14}
//                 >
//                   {payload.value}
//                 </text>
//               )
//             }}
//           />
//           <Bar dataKey="total">
//             {dataForChart.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.color} />
//             ))}
//             <LabelList
//               dataKey="total"
//               position="insideLeft"
//               style={{ fill: "#fff" }}
//               formatter={(value: any) => `฿${parseInt(value)}k`}
//             />
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </>
//   )
// }
