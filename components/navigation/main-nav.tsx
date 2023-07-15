"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

// import { LoginDialog } from "./login-dialog"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const router = useRouter()
  const currentRoute = usePathname()
  return (
    <div className="flex gap-6 sm:gap-10">
      {currentRoute !== "/" ? (
        <Link href="/" className="flex items-center space-x-2">
          <Icons.mLogo className="w-6 h-6" />
          <span className=" sm:inline-block font-bold ">{siteConfig.name}</span>
        </Link>
      ) : (
        <Link href="/expenses" className="flex items-center space-x-2">
          <Icons.mLogo className="w-6 h-6" />
          <span className=" sm:inline-block font-bold ">{siteConfig.name}</span>
        </Link>
      )}

      {/*  */}
      {/* <LoginDialog /> */}
      {/*  */}

      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
