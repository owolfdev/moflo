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
  deleteExpenses,
  getSettingsArray,
  updateExpense,
  uploadImageToStorage,
} from "@/utils/supabase"
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
import { ToastAction } from "@/components/ui/toast"
import { toast, useToast } from "@/components/ui/use-toast"
import FileUpload from "@/components/custom-file-picker"
import { ToastDemo } from "@/components/custom-toast"
import { DeleteItemDialog } from "@/components/delete-item-dialog"
import { RSSelect, RSSelectMulti } from "@/components/rs-select"
import { MultiSelect } from "@/components/scn-multi-select"

// const languages = [
//   { label: "English", value: "en" },
//   { label: "French", value: "fr" },
//   { label: "German", value: "de" },
//   { label: "Spanish", value: "es" },
//   { label: "Portuguese", value: "pt" },
//   { label: "Russian", value: "ru" },
//   { label: "Japanese", value: "ja" },
//   { label: "Korean", value: "ko" },
//   { label: "Chinese", value: "zh" },
// ] as const

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
  id: z.string().optional(),
})

interface Expense {
  id: string
  date: string
  user_id: string
  amount: number
  description: string
  location: string
  account: string
  categories: string
  currency: string
  merchant: string
  receipt: string
  author: string
}

export function ExpenseFormEdit({
  settings,
  expense,
}: {
  settings: any
  expense: Expense
}) {
  const [merchants, setMerchants] = useState<string[]>([])
  const [accounts, setAccounts] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMerchant, setSelectedMerchant] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const router = useRouter()

  const { toast } = useToast()

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [merchant, setMerchant] = useState("")
  const [location, setLocation] = useState("")
  const [account, setAccount] = useState("")
  const [categories, setCategories] = useState<string[]>([])
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
      id: "",
    },
  })

  const { handleSubmit, control, setValue } = form

  useEffect(() => {
    // Set the form field values when the expense data changes
    setValue("amount", (expense.amount / 100).toFixed(2))
    setValue("description", expense.description)
    setValue("merchant", expense.merchant)
    setValue("location", expense.location)
    setValue("account", expense.account)
    setValue(
      "categories",
      expense.categories.split(",") as [string, ...string[]]
    )
    // setValue("receipt", expense.receipt);
    setValue("id", expense.id)
  }, [expense, setValue])

  useEffect(() => {
    // Set the default values
    setAmount((expense.amount / 100).toFixed(2))
    setDescription(expense.description)
    setMerchant(expense.merchant)
    setLocation(expense.location)
    setAccount(expense.account)
    setCategories(expense.categories.split(","))
  }, [expense])

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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // const receiptToUse = values.receipt ? values.receipt : expense.receipt

    let receiptUrl = null
    if (receipt) {
      console.log("values.receipt:", values.receipt)
      receiptUrl = await uploadImageToStorage(receipt)
      console.log("receiptUrl:", receiptUrl)
    } else {
      receiptUrl = expense.receipt
    }

    toast({
      title: "Your expense has been edited.",
      description: ``,
      duration: 2000,
      action: (
        <ToastAction altText="Your expense has been edited">OK</ToastAction>
      ),
    })

    const expenseData = {
      amount: formatCurrencyForDatabase(values.amount),
      description: values.description,
      merchant: values.merchant,
      location: values.location,
      categories: values.categories.join(","),
      account: values.account,
      receipt: receiptUrl,
      id: values.id,
    }

    console.log("expenseData:", expenseData)

    await updateExpense(expenseData.id, expenseData)
    router.push("/expenses")
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

  const handleClick = () => {
    console.log("toast test clicked")
    toast({
      title: "Hello, World!",
      description: "This is a toast message.",
      duration: 2000,
    })
  }

  const handleDeleteExpense = async () => {
    console.log("delete expense")
    // await deleteExpenses([expense.id])
    // router.push("/expenses")
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
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
                        // placeholder={(expense.amount / 100).toFixed(2)}
                        className="input-no-zoom, sm:text-base text-lg"
                        onChange={(e) => {
                          // setAmount(e.target.value)
                          field.onChange(e.target.value)
                        }}
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
                    {...field}
                    className="input-no-zoom, sm:text-base text-lg"
                    placeholder="Add a description"
                    onChange={(e) => {
                      // setDescription(e.target.value)
                      field.onChange(e.target.value)
                    }}
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
                      setValue("merchant", item, { shouldValidate: true })
                    }}
                    controls={false}
                    placeholder={expense.merchant}
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
                    {...field}
                    className="input-no-zoom, sm:text-base text-lg"
                    placeholder="Add a location"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value)
                      field.onChange(e.target.value)
                    }}
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
                    placeholder={expense.account}
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
            <Button type="submit" variant="default">
              Save Edits
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.push("/expenses")}
            >
              Cancel
            </Button>
          </div>
          {/* <Button
            variant="destructive"
            type="button"
            onClick={handleDeleteExpense}
          >
            Delete Expense
          </Button> */}
          <DeleteItemDialog expenseId={expense.id as string} />
        </form>
      </Form>
    </>
  )
}
