import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  PostgrestResponse,
  SupabaseClient,
  createClient,
} from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)
const supabase = createClientComponentClient()
const PAGE_SIZE = 10

export const fetchExpenses = async () => {
  // console.log("page", page);
  const { data, error } = await supabase.from("expenses").select("*")
  // .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (error) {
    throw error
  }

  return data
}

export const fetchExpensesSSP = async (page, pageSize) => {
  const start = page * pageSize + 1
  const end = (page + 1) * pageSize

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .range(start, end)

  if (error) {
    throw error
  }

  return data
}

export const getTotalRecordCount = async () => {
  const { count, error } = await supabase
    .from("expenses")
    .select("count", { count: "exact" })

  if (error) {
    throw error
  }

  return count
}

export const addExpense = async (expenseData) => {
  const { data, error } = await supabase.from("expenses").insert([expenseData])

  if (error) {
    throw error
  }

  console.log("data from add expense:", data)

  return data
}

export const fetchExpenseById = async (expenseId) => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", expenseId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const deleteExpenses = async (expenseIds) => {
  console.log("expenseIds", expenseIds)

  const { data, error } = await supabase
    .from("expenses")
    .delete()
    .in("id", expenseIds)

  if (error) {
    throw error
  }

  console.log("data from delete expense:", data)

  return data
}

export const updateExpense = async (expenseId, expenseData) => {
  console.log("from util, updated expense!!!: expense.id:", expenseId)
  if (typeof expenseData.categories === "string") {
    const categories = expenseData.categories.split(",")
    expenseData.categories = categories
  }

  const { data, error } = await supabase
    .from("expenses")
    .update(expenseData)
    .eq("id", expenseId)

  if (error) {
    throw error
  }

  return data
}

export const uploadImageToStorage = async (file) => {
  const timestamp = Date.now() // Get current timestamp
  const filename = `${timestamp}_${file.name}` // Append timestamp to the original filename

  const { data, error } = await supabase.storage
    .from("expenses")
    .upload(filename, file)

  if (error) {
    throw error
  }

  const urlData = await supabase.storage
    .from("expenses")
    .getPublicUrl(data.path || "")

  console.log("image upload url from back end:", urlData.data.publicUrl)

  const publicUrl = urlData.data.publicUrl

  return publicUrl
}

export const getSettingsArray = async (title) => {
  const { data, error } = await supabase
    .from("expenses_settings")
    .select("setting_array")
    .eq("title", title)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const addNewMerchant = async (newMerchantsArray) => {
  const { data, error } = await supabase
    .from("expenses_settings")
    .update({
      setting_array: [...newMerchantsArray],
    })
    .eq("title", "merchants")

  if (error) {
    throw error
  }

  return data
}

export const addNewCategory = async (newCategoriesArray) => {
  const { data, error } = await supabase
    .from("expenses_settings")
    .update({
      setting_array: [...newCategoriesArray],
    })
    .eq("title", "categories")

  if (error) {
    throw error
  }

  return data
}

export const addNewAccount = async (newAccountsArray) => {
  const { data, error } = await supabase
    .from("expenses_settings")
    .update({
      setting_array: [...newAccountsArray],
    })
    .eq("title", "accounts")

  if (error) {
    throw error
  }

  return data
}

export async function fetchTablePolicies(tableName) {
  try {
    const { data, error } = await supabase
      .from("pg_table_policies")
      .select()
      .eq("table_name", tableName)
    if (error) {
      throw error
    }
    return data
  } catch (error) {
    console.error("Error fetching table policies:", error.message)
    return null
  }
}
