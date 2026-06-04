import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBudgets } from '../api/budgetService'
import axiosInstance from '../api/axiosInstance'
import { fetchAlerts } from '../api/alertService'
import { filterActiveAlerts } from '../utils/alertStorage'
import { isAuthenticated } from '../utils/auth'
import { ArrowDownCircle, ArrowUpCircle, Scale, TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

const monthLabel = () =>
  new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

export const ExpenseDashboard = () => {
  const [budgets, setBudgets] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const signedIn = isAuthenticated()

  useEffect(() => {
    if (!signedIn) {
      setBudgets([])
      setSummary(null)
      setTransactions([])
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        const [budgetRes, summaryRes, expenseRes, incomeRes] = await Promise.all([
          fetchBudgets(true),
          axiosInstance.get('/exp/summary'),
          axiosInstance.get('/exp/expbyuserid?type=expense&date=-1'),
          axiosInstance.get('/exp/expbyuserid?type=income&date=-1')
        ])
        const data = Array.isArray(budgetRes.data?.data) ? budgetRes.data.data : []
        setBudgets(data.slice(0, 3))
        setSummary(summaryRes.data?.data || null)

        const rawExpenses = Array.isArray(expenseRes.data?.data) ? expenseRes.data.data : []
        const rawIncomes = Array.isArray(incomeRes.data?.data) ? incomeRes.data.data : []
        const taggedExpenses = rawExpenses.map(item => ({ ...item, recordType: 'expense' }))
        const taggedIncomes = rawIncomes.map(item => ({ ...item, recordType: 'income' }))
        const merged = [...taggedExpenses, ...taggedIncomes].sort(
          (a, b) => new Date(b.expenseDate) - new Date(a.expenseDate)
        )
        setTransactions(merged)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [signedIn])

  // Aggregate monthly trend for the last 6 months
  const monthlyTrendData = React.useMemo(() => {
    if (!transactions.length) return null

    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = d.toLocaleString('en-IN', { month: 'short' })
      const year = d.getFullYear()
      months.push({
        label: `${monthName} ${year}`,
        monthVal: d.getMonth(),
        yearVal: d.getFullYear(),
        income: 0,
        expense: 0
      })
    }

    transactions.forEach(t => {
      const tDate = new Date(t.expenseDate)
      const tMonth = tDate.getMonth()
      const tYear = tDate.getFullYear()

      const match = months.find(m => m.monthVal === tMonth && m.yearVal === tYear)
      if (match) {
        const amount = Number(t.recordType === 'expense' ? t.amount : t.income || 0)
        if (t.recordType === 'expense') {
          match.expense += amount
        } else {
          match.income += amount
        }
      }
    })

    return {
      labels: months.map(m => m.label),
      datasets: [
        {
          label: 'Income',
          data: months.map(m => m.income),
          backgroundColor: '#437f65',
          borderRadius: 4,
        },
        {
          label: 'Expense',
          data: months.map(m => m.expense),
          backgroundColor: '#ef4444',
          borderRadius: 4,
        }
      ]
    }
  }, [transactions])

  // Aggregate category wise expenses for current month
  const categoryData = React.useMemo(() => {
    if (!transactions.length) return null

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const currentMonthExpenses = transactions.filter(t => {
      if (t.recordType !== 'expense') return false
      const tDate = new Date(t.expenseDate)
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear
    })

    if (!currentMonthExpenses.length) return null

    const categoriesMap = {}
    currentMonthExpenses.forEach(t => {
      const catName = t.expCat?.catName || 'Other'
      const amount = Number(t.amount || 0)
      categoriesMap[catName] = (categoriesMap[catName] || 0) + amount
    })

    const labels = Object.keys(categoriesMap)
    const data = Object.values(categoriesMap)

    const colors = [
      '#437f65',
      '#3b82f6',
      '#ef4444',
      '#f59e0b',
      '#10b981',
      '#6366f1',
      '#8b5cf6',
      '#ec4899',
    ]

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1,
        }
      ]
    }
  }, [transactions])

  useEffect(() => {
    if (!signedIn) return

    const showAlertToast = async () => {
      if (sessionStorage.getItem('alert-toast-shown')) return
      try {
        const data = await fetchAlerts()
        const active = filterActiveAlerts(data)
        if (active.length > 0) {
          const urgent = active.filter((a) => a.level === 'danger').length
          toast.info(
            urgent > 0
              ? `${urgent} budget exceeded! Check Notifications.`
              : `You have ${active.length} alert(s). Open Notifications.`,
            { autoClose: 5000 }
          )
          sessionStorage.setItem('alert-toast-shown', '1')
        }
      } catch {
        /* ignore */
      }
    }
    showAlertToast()
  }, [signedIn])

  const activeBudgets = budgets.filter((b) => b.budgetStatus === 'active')
  const exceededCount = budgets.filter((b) => b.isExceeded).length

  const statCards = [
    {
      label: 'Income this month',
      value: formatCurrency(summary?.totalIncome),
      icon: ArrowUpCircle,
      tone: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Expense this month',
      value: formatCurrency(summary?.totalExpense),
      icon: ArrowDownCircle,
      tone: 'text-red-600 bg-red-50 border-red-100',
    },
    {
      label: 'Balance',
      value: formatCurrency(summary?.balance),
      icon: Scale,
      tone:
        (summary?.balance ?? 0) >= 0
          ? 'text-primary bg-primary-50 border-primary-100'
          : 'text-amber-700 bg-amber-50 border-amber-100',
    },
    {
      label: 'Transactions',
      value: loading
        ? '...'
        : `${(summary?.expenseCount ?? 0) + (summary?.incomeCount ?? 0)} records`,
      icon: TrendingUp,
      tone: 'text-slate-700 bg-slate-50 border-slate-200',
    },
  ]

  const guestStatValue = (label) =>
    label === 'Transactions' ? 'Sign in to view' : '—'

  return (
    <div className="space-y-6">
      {!signedIn && (
        <section className="rounded-lg border border-primary-100 bg-primary-50/80 p-5 sm:p-6">
          <p className="text-sm font-semibold text-primary-900">You&apos;re browsing as a guest</p>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Explore the app layout below. Sign in when you want to add records, budgets, or view your real data.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/login"
              state={{ from: { pathname: '/' } }}
              className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Create account
            </Link>
          </div>
        </section>
      )}

      <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
        <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Overview</p>
        <h1 className="text-3xl font-semibold text-slate-950">Expense Dashboard</h1>
        <p className="text-slate-500 mt-3 max-w-2xl">
          {monthLabel()} — track income, expenses, budgets, and reports from one place.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className={`rounded-lg border p-5 ${tone}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
                <p className="text-2xl font-bold mt-2">
                  {!signedIn
                    ? guestStatValue(label)
                    : loading && label !== 'Transactions'
                      ? '...'
                      : value}
                </p>
              </div>
              <Icon size={28} className="shrink-0 opacity-70" />
            </div>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <Link
          to="/my-expenses"
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-primary-200 transition-colors"
        >
          <h2 className="text-lg font-semibold text-slate-950">Records</h2>
          <p className="text-sm text-slate-500 mt-2">Add, edit, and manage income or expense entries.</p>
        </Link>

        <Link
          to="/my-budgets"
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-primary-200 transition-colors"
        >
          <h2 className="text-lg font-semibold text-slate-950">Budgets</h2>
          <p className="text-sm text-slate-500 mt-2">
            {loading ? 'Loading...' : `${activeBudgets.length} active · ${exceededCount} exceeded`}
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

      {/* Visual Analytics Section */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-950">Visual Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Cash flow trends and category wise expense distribution</p>
        </div>

        {transactions.length === 0 ? (
          <p className="text-slate-500 text-sm">No transaction records found to visualize.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cash Flow Chart */}
            <div className="md:col-span-2 relative h-[300px]">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Cash Flow Trend (Last 6 Months)</h3>
              {monthlyTrendData && (
                <Bar
                  data={monthlyTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `₹${value}`
                        }
                      }
                    }
                  }}
                />
              )}
            </div>

            {/* Category Breakdown Chart */}
            <div className="relative h-[300px] flex flex-col">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Category Share (This Month)</h3>
              {categoryData ? (
                <div className="flex-1 min-h-0 relative">
                  <Doughnut
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                  No expense records found this month
                </div>
              )}
            </div>
          </div>
        )}
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

        {!signedIn ? (
          <p className="text-slate-500 text-sm">
            Sign in to see your budgets.{' '}
            <Link to="/login" state={{ from: { pathname: '/add-budget' } }} className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        ) : loading ? (
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
                  <span className="font-medium text-slate-800">Limit {formatCurrency(budget.maxAmount)}</span>
                  <span className="text-slate-500">{budget.percentUsed ?? 0}% used</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${budget.isExceeded ? 'bg-red-500' : 'bg-primary'}`}
                    style={{ width: `${Math.min(100, budget.percentUsed ?? 0)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Spent {formatCurrency(budget.spent)} · Remaining {formatCurrency(budget.remaining)}
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
