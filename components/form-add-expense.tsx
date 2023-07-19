"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { settings } from "@/data/settings"
import { formatCurrencyForDatabase } from "@/utils/formatCurrency"
import {
  addExpense,
  addNewAccount,
  addNewCategory,
  addNewMerchant,
  getSettingsArray,
  uploadImageToStorage,
} from "@/utils/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, format, set } from "date-fns"
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
import { ToastAction } from "@/components/ui/toast"
import { toast, useToast } from "@/components/ui/use-toast"
import FileUpload from "@/components/custom-file-picker"
import { ToastDemo } from "@/components/custom-toast"
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

// Define the file schema
const fileSchema = z.object({
  name: z.string(), // The name of the file
  type: z.string(), // The MIME type of the file
  size: z.number(), // The size of the file in bytes
})

const formSchema = z.object({
  // amount: z.number().positive().min(0).max(10000000),
  amount: z.string().min(1).max(50),
  description: z.string().min(2).max(1000),
  merchant: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  account: z.string().min(2).max(50),
  categories: z.array(z.string()).nonempty(),
  receipt: fileSchema.optional(),
})

export function ExpenseFormAdd({ settings }: { settings: any }) {
  const [categories, setCategories] = useState<string[]>([])
  const [merchants, setMerchants] = useState<string[]>([])
  const [accounts, setAccounts] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMerchant, setSelectedMerchant] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      merchant: "",
      location: "",
      account: "",
      categories: [],
      receipt: {
        name: "",
        type: "",
        size: 0,
      },
    },
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getSettingsArray("categories")
        const settingArray = data.setting_array
        // console.log("categories array:", settingArray);
        setCategories([...settingArray])
      } catch (error) {
        // Handle error
        console.error(error)
      }
    }
    fetchCategoriesData()
    // //
    const fetchMerchantsData = async () => {
      try {
        const data = await getSettingsArray("merchants")
        const settingArray = data.setting_array
        // console.log("merchants array:", settingArray);
        setMerchants([...settingArray])
      } catch (error) {
        // Handle error
        console.error(error)
      }
    }
    fetchMerchantsData()
    // //
    const fetchAccountsData = async () => {
      try {
        const data = await getSettingsArray("accounts")
        const settingArray = data.setting_array
        // console.log("accounts array:", settingArray);
        setAccounts([...settingArray])
      } catch (error) {
        // Handle error
        console.error(error)
      }
    }
    fetchAccountsData()
  }, [])

  const { handleSubmit, control, setValue } = form

  // 2. Define a submit handler.
  async function handleAddExpense(values: z.infer<typeof formSchema>) {
    //

    //get the receipt url
    let receiptUrl = null
    if (receipt) {
      console.log("values.receipt:", values.receipt)
      receiptUrl = await uploadImageToStorage(receipt)
      console.log("receiptUrl:", receiptUrl)
    }

    //toast
    toast({
      title: `Your expense from ${values.merchant} has been recorded.`,
      description: `Expense Amount: $${values.amount}`,
      duration: 2000,
      action: (
        <ToastAction altText="Your expense has been recorded.">OK</ToastAction>
      ),
    })
    //

    //
    console.log("values", values.categories.join(","))

    const expenseData = {
      amount: formatCurrencyForDatabase(values.amount),
      description: values.description,
      merchant: values.merchant,
      location: values.location,
      categories: values.categories.join(","),
      account: values.account,
      receipt: receiptUrl,
    }

    await addExpense(expenseData)
    router.push("/expenses")

    //
  }

  function handleInputTap(event: any) {
    event.target.classList.add("input-no-zoom")
  }

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Update the receipt field
      console.log("heres the file:", file)
      setValue("receipt", file, { shouldValidate: true })
      setReceipt(file)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddExpense)}
          className="space-y-4 "
        >
          {/* amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-md">Amount</FormLabel>
                <FormControl>
                  <Controller
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Add an amount"
                        className="input-no-zoom, sm:text-base text-lg"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* description */}
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
                <FormLabel className="font-semibold text-md">
                  Merchant
                </FormLabel>
                <FormControl>
                  <RSSelect
                    instanceId="fruit"
                    items={merchants}
                    setSelectedItem={(item) => {
                      setValue("merchant", item, { shouldValidate: true }) // Set the value using React Hook Form only
                    }}
                    controls={false}
                    placeholder="Select a merchant"
                  />
                </FormControl>
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
                <FormLabel className="font-semibold text-md">
                  Location
                </FormLabel>
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
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-md">
                  Categories
                </FormLabel>
                <FormControl>
                  <RSSelectMulti
                    instanceId="categories"
                    items={categories}
                    setSelectedItems={(items) => {
                      setValue("categories", items as [string, ...string[]], {
                        shouldValidate: true,
                      })
                    }}
                    selectedItems={field.value}
                    placeholder="Select categories"
                  />
                </FormControl>
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
                    items={accounts}
                    setSelectedItem={(item) => {
                      setValue("account", item, { shouldValidate: true }) // Set the value using React Hook Form only
                    }}
                    controls={false}
                    placeholder="Select an account"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receipt"
            render={({ field }) => (
              <FormItem className="flex flex-col w-[200px]">
                <FormLabel className="font-semibold text-md">Receipt</FormLabel>
                <FormControl>
                  <FileUpload onChange={handleFileChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit">Save Expense</Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.push("/expenses")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
