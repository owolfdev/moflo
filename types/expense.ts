export type Expense = {
  id: string
  date: string
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
