"use client"

import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginDialog() {
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const handleChangeInputValue = (e: any) => {
    if (e.target.id === "email") console.log("email:", e.target.value)
    if (e.target.id === "password") console.log("password:", e.target.value)
  }

  const handleSaveChanges = () => {
    // Put your save changes logic here

    console.log("Saving changes...")

    closeDialogRef.current?.click()

    // Close the dialog
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <span className="text-sm font-semibold hover:text-slate-800 cursor-pointer hover:bg-slate-100 sm:py-2 sm:px-3 rounded-md">
            Sign In
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log In</DialogTitle>
            <DialogDescription>
              Log in to your account to continue
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                className="col-span-3"
                onChange={handleChangeInputValue}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                className="col-span-3"
                onChange={handleChangeInputValue}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              as={Button}
              action={handleSaveChanges}
              className={buttonVariants({
                variant: "secondary",
                size: "default",
              })}
            >
              Sign In
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

LoginDialog.displayName = "LoginDialog"
