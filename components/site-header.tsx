import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { AuthAvatar } from "@/components/avatar"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href={"/settings"}>
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.settings className="w-5 h-5" />
                <span className="sr-only">Settings</span>
              </div>
            </Link>
            <Link href={"/docs"}>
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.docs className="w-5 h-5" />
                <span className="sr-only">Documentation</span>
              </div>
            </Link>
            <ThemeToggle />
            <div className=" pl-2">
              <AuthAvatar />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
