import * as React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ReChartBar } from "@/components/rechart-bar-chart"
import { ReChartPie } from "@/components/rechart-pie-chart"

export default async function StatsPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/about")
  }

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Analytics
        </h1>
        <div className="flex flex-col w-full gap-8 h-[500px] mt-8">
          <Card>
            <CardHeader>
              <CardTitle>12 Month Overview</CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div>
                <ReChartBar />
              </div>
            </CardContent>
            {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
          </Card>
          {/* <Card className="w-full">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <ReChartPie />
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </section>
  )
}
