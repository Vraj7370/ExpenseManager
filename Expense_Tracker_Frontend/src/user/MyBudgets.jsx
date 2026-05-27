import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Pencil, Trash2, Wallet, X } from 'lucide-react'
import {
  deleteBudget,
  fetchBudgets,
  updateBudget
} from '../api/budgetService'

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

const toDateInput = (value) => {
  if (!value) return ''
  const d = new Date(value)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().split('T')[0]
}

const emptyEditForm = {
  maxAmount: '',
  createdDate: '',
  endDate: '',
  budgetStatus: 'active'
}

export const MyBudgets = () => {
  const navigate = useNavigate()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState(emptyEditForm)
  const [saving, setSaving] = useState(false)

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchBudgets(true)
      setBudgets(Array.isArray(res.data?.data) ? res.data.data : [])
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to load budgets')
      setBudgets([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])

  const openEdit = (budget) => {
    setEditing(budget)
    setEditForm({
      maxAmount: String(budget.maxAmount ?? ''),
      createdDate: toDateInput(budget.createdDate),
      endDate: toDateInput(budget.endDate),
      budgetStatus: budget.budgetStatus || 'active'
    })
  }

  const closeEdit = () => {
    setEditing(null)
    setEditForm(emptyEditForm)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editing) return

    const maxAmount = Number(editForm.maxAmount)
    if (!maxAmount || maxAmount <= 0) {
      toast.error('Max amount must be greater than 0')
      return
    }

    try {
      setSaving(true)
      const payload = {
        maxAmount,
        createdDate: editForm.createdDate || undefined,
        endDate: editForm.endDate || undefined,
        budgetStatus: editForm.budgetStatus
      }

      await updateBudget(editing._id, payload)
      toast.success('Budget updated successfully')
      closeEdit()
      loadBudgets()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update budget')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this budget?')
    if (!confirmed) return

    try {
      await deleteBudget(id)
      setBudgets((prev) => prev.filter((b) => b._id !== id))
      toast.success('Budget deleted successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete budget')
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">
            Budgets
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">My Budgets</h1>
          <p className="text-slate-500 text-sm mt-2">
            Track limits, spending, and remaining balance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="px-3 py-2 bg-white text-slate-700 rounded-md text-sm border border-slate-200">
            Total: {budgets.length}
          </span>
          <button
            type="button"
            onClick={() => navigate('/add-budget')}
            className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
          >
            + Add Budget
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center bg-white border border-slate-200 rounded-lg py-16 text-slate-500">
          Loading budgets...
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center bg-white border border-dashed border-slate-300 rounded-lg py-16 text-slate-500">
          <Wallet className="mx-auto mb-3 text-slate-400" size={32} />
          <p>No budgets yet.</p>
          <button
            type="button"
            onClick={() => navigate('/add-budget')}
            className="mt-4 px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover"
          >
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {budgets.map((budget) => {
            const percent = budget.percentUsed ?? 0
            const barColor = budget.isExceeded
              ? 'bg-red-500'
              : percent >= 80
                ? 'bg-amber-500'
                : 'bg-primary'

            return (
              <div
                key={budget._id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">
                      {formatCurrency(budget.maxAmount)}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(budget.createdDate)} — {formatDate(budget.endDate)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      budget.budgetStatus === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {budget.budgetStatus}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Spent: {formatCurrency(budget.spent)}</span>
                    <span>Remaining: {formatCurrency(budget.remaining)}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{percent}% used</p>
                  {budget.isExceeded && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      Budget exceeded
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openEdit(budget)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(budget._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-100"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-950">Edit Budget</h3>
              <button
                type="button"
                onClick={closeEdit}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Max Amount (₹)
                </label>
                <input
                  type="number"
                  name="maxAmount"
                  min="1"
                  value={editForm.maxAmount}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="createdDate"
                    value={editForm.createdDate}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={editForm.endDate}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  name="budgetStatus"
                  value={editForm.budgetStatus}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="not active">Not Active</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
