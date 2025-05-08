'use client'

import { useState, useEffect, FormEvent } from 'react';

type Expense = {
  id: number
  name: string
  cost: number
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')

  const API = 'http://localhost:3001'

  const fetchExpenses = async () => {
    const res = await fetch(`${API}/api/expenses`)
    const json = await res.json()
    if (json.success) setExpenses(json.response)
  }

  const deleteExpense = async (id: number) => {
    const res = await fetch(`${API}/api/expense/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (json.success) setExpenses(json.response)
  }

  const addExpense = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !cost) return
    const res = await fetch(`${API}/api/create-expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, cost: Number(cost) }),
    })
    const json = await res.json()
    if (json.success) {
      setExpenses(prev => [...prev, json.response])
      setName('')
      setCost('')
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 min-h-screen bg-gray-100">
    <div className="w-full sm:px-4 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto mt-16 px-4">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Expense Tracker
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-12">
        <h2 className="text-lg font-semibold mb-4 text-black">Add New Expense</h2>
        <form onSubmit={addExpense} className="space-y-4">
          <input
            type="text"
            placeholder="Expense Name"
            className="w-full placeholder-gray-400 text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Cost"
            className="w-full placeholder-gray-400 text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={cost}
            onChange={e => setCost(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add Expense
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-black">Your Expenses</h2>
      <div className="divide-y text-black">
        {expenses.map(exp => (
          <div
            key={exp.id}
            className="bg-white border-white rounded-xl shadow p-6 flex justify-between items-center mb-4"
          >
            <span className="font-medium">
              {exp.name} - ${exp.cost.toFixed(2)}
            </span>
            <button
              onClick={() => deleteExpense(exp.id)}
              className="px-3 py-1 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
