export type Expense = {
  id: string
  created_at: string
  user_id: string | null
  amount: number
  description: string
  location: string
  account: string
  categories: string
  currency: string | null
  merchant: string
  receipt: string | null
  author: string | null
}
