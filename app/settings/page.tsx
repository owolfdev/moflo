import React from "react"

import { ThemeToggle } from "@/components/theme-toggle"

const Settings = () => {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Settings
        </h1>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </section>
  )
}

export default Settings
