import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBudgets } from '../api/budgetService'

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

export const ExpenseDashboard = () => {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchBudgets(true)
        const data = Array.isArray(res.data?.data) ? res.data.data : []
        setBudgets(data.slice(0, 3))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeBudgets = budgets.filter((b) => b.budgetStatus === 'active')
  const exceededCount = budgets.filter((b) => b.isExceeded).length

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
        <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">
          Overview
        </p>
        <h1 className="text-3xl font-semibold text-slate-950">Expense Dashboard</h1>
        <p className="text-slate-500 mt-3 max-w-2xl">
          Track categories, records, budgets, and reports from the sidebar.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <Link
          to="/my-expenses"
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-primary-200 transition-colors"
        >
          <h2 className="text-lg font-semibold text-slate-950">Records</h2>
          <p className="text-sm text-slate-500 mt-2">Add and manage income or expense entries.</p>
        </Link>

        <Link
          to="/my-budgets"
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-primary-200 transition-colors"
        >
          <h2 className="text-lg font-semibold text-slate-950">Budgets</h2>
          <p className="text-sm text-slate-500 mt-2">
            {loading
              ? 'Loading...'
              : `${activeBudgets.length} active · ${exceededCount} exceeded`}
          </p>
        </Link>

        <Link
          to="/reports"
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-primary-200 transition-colors"
        >
          <h2 className="text-lg font-semibold text-slate-950">Reports</h2>
          <p className="text-sm text-slate-500 mt-2">Category and payment mode summaries.</p>
        </Link>
      </section>

      <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Budget snapshot</h2>
            <p className="text-sm text-slate-500 mt-1">Recent budgets with spending progress</p>
          </div>
          <Link
            to="/add-budget"
            className="inline-flex justify-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover"
          >
            + Add Budget
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500 text-sm">Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No budgets yet.{' '}
            <Link to="/add-budget" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget._id} className="border border-slate-100 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-800">
                    Limit {formatCurrency(budget.maxAmount)}
                  </span>
                  <span className="text-slate-500">{budget.percentUsed ?? 0}% used</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      budget.isExceeded ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(100, budget.percentUsed ?? 0)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Spent {formatCurrency(budget.spent)} · Remaining{' '}
                  {formatCurrency(budget.remaining)}
                </p>
              </div>
            ))}
            <Link to="/my-budgets" className="text-sm text-primary font-medium hover:underline">
              View all budgets →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
