"use client"

import React, { useState } from "react"
import Link from "next/link"
import { settings } from "@/data/settings"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { RSSelect, RSSelectMulti } from "@/components/rs-select"
import { MultiSelect } from "@/components/scn-multi-select"

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const merchants = settings.merchants.map((merchant) => ({
  label: merchant,
  value: merchant,
}))

const dummyOptionsForSelect = [
  { label: "wolf@owolf.com", value: "wolf@owolf.com" },
  { label: "oliver@owolf.com", value: "oliver@owolf.com" },
  { label: "admin@owolf.com", value: "admin@owolf.com" },
]

const formSchema = z.object({
  amount: z.number().positive().min(0).max(10000000),
  description: z.string().min(2).max(1000),
  merchant: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  account: z.string().min(2).max(50),

  dob: z.date().min(new Date("1900-01-01")).max(new Date()), // Make dob optional
  mobile: z.boolean().default(false).optional(),
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  multi: z.array(z.string()).nonempty(),
  language: z.string({
    required_error: "Please select a language.",
  }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(1000, {
      message: "Bio must not be longer than 1000 characters.",
    }),
})

export function ExpenseForm({ settings }: { settings: any }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMerchant, setSelectedMerchant] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      dob: undefined, // Set dob to undefined
      mobile: true,
      multi: [],
      security_emails: true,
    },
  })

  const { handleSubmit, control } = form

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // const updatedValues = {
    //   ...values,
    //   multi: selectedCategories, // Insert the selected values into the updatedValues object
    // }
    console.log(values)
    toast({
      title: "You submitted the following values:",
      duration: 2000,
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  function handleInputTap(event: any) {
    event.target.classList.add("input-no-zoom")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-md">Amount</FormLabel>
              <FormControl>
                <Input
                  className="input-no-zoom, sm:text-base text-lg"
                  placeholder="Add an amount"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-md">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  className="input-no-zoom, sm:text-base text-lg"
                  placeholder="Add a description"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                This is your real first name and will not be visible to public.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* select merchant */}
        <FormField
          control={form.control}
          name="merchant"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-md">Merchant</FormLabel>
              <FormControl>
                <RSSelect
                  instanceId="fruit"
                  items={settings.merchants}
                  setSelectedItem={setSelectedMerchant}
                  controls={false}
                />
              </FormControl>
              {/* <FormDescription>
                This is your real first name and will not be visible to public.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-md">Location</FormLabel>
              <FormControl>
                <Input
                  className="input-no-zoom, sm:text-base text-lg"
                  placeholder="Add a location"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* select categories */}
        <FormField
          control={form.control}
          name="merchant"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-md">Merchant</FormLabel>
              <FormControl>
                <RSSelectMulti
                  instanceId="categories"
                  items={settings.categories}
                  setSelectedItems={setSelectedCategories}
                  selectedItems={selectedCategories}
                  placeholder="Select categories"
                />
              </FormControl>
              {/* <FormDescription>
                This is your real first name and will not be visible to public.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* select account */}
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-md">Account</FormLabel>
              <FormControl>
                <RSSelect
                  instanceId="account"
                  items={settings.accounts}
                  setSelectedItem={setSelectedAccount}
                  controls={false}
                />
              </FormControl>
              {/* <FormDescription>
                This is your real first name and will not be visible to public.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
