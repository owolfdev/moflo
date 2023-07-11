import React from "react"

const UnAuth = () => {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Unauthorized To Use This App
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Please sign in to use this app.
        </p>
      </div>
    </section>
  )
}

export default UnAuth
