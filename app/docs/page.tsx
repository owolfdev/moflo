import React from "react"

const Documentation = () => {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Documentation
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Moflo is an open-source expense tracking app built with Next.js and
          Supabase. {`It's`} designed to be easy to use and easy to deploy.
        </p>
      </div>
    </section>
  )
}

export default Documentation
