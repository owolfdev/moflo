"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  addNewAccount,
  addNewCategory,
  addNewMerchant,
  fetchExpenses,
  getSettingsArray,
} from "@/utils/supabase"
import { fi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ThemeToggle } from "@/components/theme-toggle"

function Settings() {
  const [accounts, setAccounts] = useState<string[]>([])
  const [merchants, setMerchants] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filterValue, setFilterValue] = useState<string>("")
  const [filterValueForMerchants, setFilterValueForMerchants] =
    useState<string>("")
  const [filterValueForCategories, setFilterValueForCategories] =
    useState<string>("")
  const [filterValueForAccounts, setFilterValueForAccounts] =
    useState<string>("")
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(true)

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

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.toLowerCase().includes(filterValueForMerchants.toLowerCase()) ||
      null
  )

  const filteredCategories = categories.filter(
    (category) =>
      category.toLowerCase().includes(filterValueForCategories.toLowerCase()) ||
      null
  )

  const filteredAccounts = accounts.filter(
    (account) =>
      account.toLowerCase().includes(filterValueForAccounts.toLowerCase()) ||
      null
  )

  useEffect(() => {
    if (filteredMerchants.length === 0) {
      setIsPopoverOpen(false)
    } else {
      setIsPopoverOpen(true)
    }
  }, [filterValueForMerchants])

  useEffect(() => {
    if (filteredCategories.length === 0) {
      setIsPopoverOpen(false)
    } else {
      setIsPopoverOpen(true)
    }
  }, [filterValueForCategories])

  useEffect(() => {
    if (filteredAccounts.length === 0) {
      setIsPopoverOpen(false)
    } else {
      setIsPopoverOpen(true)
    }
  }, [filterValueForAccounts])

  return (
    <div className="">
      <div className="mb-6">
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-4">
        {/* add new merchant */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-2">New Merchant</h2>
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
              setFilterValueForMerchants("") // Clear the input field after adding a new merchant
            }}
          >
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                className="input-no-zoom text-lg"
                name="merchant"
                placeholder="Enter merchant"
                value={filterValueForMerchants}
                onChange={(e) => setFilterValueForMerchants(e.target.value)}
                onFocus={() => setIsPopoverOpen(true)}
                onBlur={() => setIsPopoverOpen(false)}
              />
              {isPopoverOpen &&
                filterValueForMerchants &&
                filteredMerchants && (
                  <div
                    data-name="popover"
                    className="border bg-white rounded p-4 shadow absolute mt-12 z-10"
                  >
                    <ul className="flex flex-col">
                      {filteredMerchants.map((merchant) => (
                        <li key={merchant}>{merchant}</li>
                      ))}
                    </ul>
                  </div>
                )}
              <Button className="w-[200px]" type="submit">
                Add New Merchant
              </Button>
            </div>
          </form>
        </div>
        {/* add new category */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-2">New Category</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault()

              const newCategory = e.currentTarget.category.value
              if (categories.includes(newCategory)) {
                // Merchant already exists, show a message or handle accordingly
                return
              }
              const newCategories = [...categories, newCategory]
              await addNewCategory(newCategories)
              setCategories(newCategories)
              setFilterValueForCategories("") // Clear the input field after adding a new merchant
            }}
          >
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                className="input-no-zoom text-lg"
                name="category"
                placeholder="Enter category"
                value={filterValueForCategories}
                onChange={(e) => setFilterValueForCategories(e.target.value)}
                onFocus={() => setIsPopoverOpen(true)}
                onBlur={() => setIsPopoverOpen(false)}
              />
              {isPopoverOpen &&
                filterValueForCategories &&
                filteredCategories && (
                  <div
                    data-name="popover"
                    className="border bg-white rounded p-4 shadow absolute mt-12 z-10"
                  >
                    <ul className="flex flex-col">
                      {filteredCategories.map((category) => (
                        <li key={category}>{category}</li>
                      ))}
                    </ul>
                  </div>
                )}
              <Button className="w-[200px]" type="submit">
                Add New Category
              </Button>
            </div>
          </form>
        </div>
        {/* add new account */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Add New Account</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault()

              const newAccount = e.currentTarget.account.value
              if (accounts.includes(newAccount)) {
                // Merchant already exists, show a message or handle accordingly
                return
              }
              const newAccounts = [...accounts, newAccount]
              await addNewAccount(newAccounts)
              setAccounts(newAccounts)
              setFilterValueForAccounts("") // Clear the input field after adding a new merchant
            }}
          >
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                className="input-no-zoom text-lg"
                name="account"
                placeholder="Enter account"
                value={filterValueForAccounts}
                onChange={(e) => setFilterValueForAccounts(e.target.value)}
                onFocus={() => setIsPopoverOpen(true)}
                onBlur={() => setIsPopoverOpen(false)}
              />
              {isPopoverOpen && filterValueForAccounts && filteredAccounts && (
                <div
                  data-name="popover"
                  className="border bg-white rounded p-4 shadow absolute mt-12 z-10"
                >
                  <ul className="flex flex-col">
                    {filteredAccounts.map((account) => (
                      <li key={account}>{account}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button className="w-[200px]" type="submit">
                Add New Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings
