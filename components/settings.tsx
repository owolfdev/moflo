"use client"

import React, { useEffect, useState } from "react"
import {
  addNewAccount,
  addNewCategory,
  addNewMerchant,
  fetchExpenses,
  getSettingsArray,
} from "@/utils/supabase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

function Settings() {
  const [accounts, setAccounts] = useState<string[]>([])
  const [merchants, setMerchants] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filterValue, setFilterValue] = useState<string>("")

  useEffect(() => {
    const getSettings = async () => {
      const accountsData = await getSettingsArray("accounts")
      setAccounts(accountsData.setting_array)
      const merchantsData = await getSettingsArray("merchants")
      setMerchants(merchantsData.setting_array)
      const categoriesData = await getSettingsArray("categories")
      setCategories(categoriesData.setting_array)
      const expenses = await fetchExpenses()
      // const tablePolicies = await fetchTablePolicies("expenses_settings");
    }
    getSettings()
  }, [])

  const filteredMerchants = merchants.filter((merchant) =>
    merchant.toLowerCase().includes(filterValue.toLowerCase())
  )

  return (
    <div>
      <ThemeToggle />
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Merchants</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              const newMerchant = e.currentTarget.merchant.value
              if (merchants.includes(newMerchant)) {
                // Merchant already exists, show a message or handle accordingly
                return
              }
              const newMerchants = [...merchants, newMerchant]
              await addNewMerchant(newMerchants)
              setMerchants(newMerchants)
              setFilterValue("") // Clear the input field after adding a new merchant
            }}
          >
            <Input
              type="text"
              name="merchant"
              placeholder="Add new merchant"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <Button type="submit">Add</Button>
          </form>
          <ul className="flex flex-col">
            {filteredMerchants.map((merchant) => (
              <li key={merchant}>{merchant}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Settings
