import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("code:", code) // Add this line to debug the issue

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })

    console.log("supabase:", supabase) // Add this line to debug the issue

    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}
