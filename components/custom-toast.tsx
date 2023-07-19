"use client"

import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function ToastDemo() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        console.log("toast")
        toast({
          title: "Expense Saved!",
          description: "We’ve created your expense for you.",
          duration: 2000,
          action: (
            <ToastAction altText="Completed Saving Expense">OK</ToastAction>
          ),
        })
      }}
    >
      Add to calendar
    </Button>
  )
}
