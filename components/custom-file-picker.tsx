"use client"

import * as React from "react"
import { forwardRef, useImperativeHandle } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface FileUploadProps {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  onChange?: (file: File | null) => void
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const FileUpload: React.FC<FileUploadProps> = ({
  variant = "default",
  size = "default",
  onChange,
  ...props
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [fileLabel, setFileLabel] = React.useState("Select a file")

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.length) {
      onChange?.(fileInputRef.current.files[0]) // Call onChange event
      const fileName = fileInputRef.current.files[0].name
      const trimmedFileName =
        fileName.length > 20 ? `${fileName.substring(0, 15)}...` : fileName
      setFileLabel(trimmedFileName)
    }
  }

  return (
    <label className={cn(buttonVariants({ variant, size }))} {...props}>
      <span className="text-base leading-normal">{fileLabel}</span>
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </label>
  )
}

export default FileUpload
