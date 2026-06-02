import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { ExportButtons } from '../components/ExportButtons'
import { formatRecordRowsForExport } from '../utils/exportData'

const toDateInput = (date = new Date()) => {
  const d = new Date(date)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().split('T')[0]
}

const emptyEditForm = {
  title: '',
  description: '',
  amount: '',
  expenseDate: '',
  paymentMode: 'CASH',
  categoryId: '',
}

export const MyExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState(1)
  const [dateSort, setDateSort] = useState(1)
  const [type, settype] = useState('expense')
  const [searchTerm, setSearchTerm] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState(emptyEditForm)
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const searchTimer = useRef(null)

  const getMyExpenses = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(
        `/exp/expbyuserid?sort=${sort}&date=${dateSort}&type=${type}`
      )
      setExpenses(Array.isArray(res.data?.data) ? res.data.data : [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const searchRecords = async (query) => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(
        `/exp/search?expName=${encodeURIComponent(query)}&type=${type}`
      )
      setExpenses(Array.isArray(res.data?.data) ? res.data.data : [])
    } catch (err) {
      console.error(err)
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async (recordType) => {
    try {
      const endpoint =
        recordType === 'income' ? '/incomeCat/incomeCategory' : '/expCat/userCategory'
      const res = await axiosInstance.get(endpoint)
      setCategories(Array.isArray(res.data?.data) ? res.data.data : [])
    } catch {
      setCategories([])
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (searchTimer.current) clearTimeout(searchTimer.current)

    if (!value.trim()) {
      getMyExpenses()
      return
    }

    searchTimer.current = setTimeout(() => {
      searchRecords(value.trim())
    }, 350)
  }

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?')
    if (!confirmDelete) return

    try {
      await axiosInstance.delete(`/exp/delete/${id}`)
      setExpenses((prev) => prev.filter((exp) => exp._id !== id))
      toast.success('Deleted successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const openEdit = async (record) => {
    const recordType = type
    await loadCategories(recordType)
    setEditing(record)
    setEditForm({
      title: record.title || '',
      description: record.description || '',
      amount: String(recordType === 'expense' ? record.amount : record.income ?? ''),
      expenseDate: toDateInput(record.expenseDate),
      paymentMode: record.paymentMode || 'CASH',
      categoryId:
        recordType === 'expense'
          ? record.expCat?._id || record.expCat || ''
          : record.incomeCategory?._id || record.incomeCategory || '',
    })
  }

  const closeEdit = () => {
    setEditing(null)
    setEditForm(emptyEditForm)
    setCategories([])
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editing) return

    const amountNum = Number(editForm.amount)
    if (!editForm.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!amountNum || amountNum <= 0) {
      toast.error('Enter a valid amount')
      return
    }

    const payload = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      expenseDate: editForm.expenseDate,
      paymentMode: editForm.paymentMode,
    }

    if (type === 'income') {
      payload.income = amountNum
      payload.incomeCategory = editForm.categoryId
    } else {
      payload.amount = amountNum
      payload.expCat = editForm.categoryId
    }

    try {
      setSaving(true)
      const res = await axiosInstance.put(`/exp/update/${editing._id}`, payload)
      const updated = res.data?.data
      if (updated) {
        setExpenses((prev) => prev.map((row) => (row._id === editing._id ? updated : row)))
      }
      toast.success('Record updated')
      closeEdit()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    setSearchTerm('')
    getMyExpenses()
  }, [sort, dateSort, type])

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
  }, [])

  const controlClass =
    'w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500'

  const { headers: exportHeaders, rows: exportRows } = formatRecordRowsForExport(expenses, type)
  const csvRows = [exportHeaders, ...exportRows]
  const dateSlug = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Ledger</p>
          <h1 className="text-3xl font-semibold text-slate-950">
            My {type === 'expense' ? 'Expenses' : 'Income'}
          </h1>
          <p className="text-slate-500 text-sm mt-2">Search, sort, edit, and manage your financial records.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="px-3 py-2 rounded-md text-sm border border-slate-200 bg-white text-slate-700">
            Total: {expenses.length}
          </div>
          <ExportButtons
            filename={`${type}-records-${dateSlug}`}
            csvRows={csvRows}
            pdfTitle={`${type === 'expense' ? 'Expense' : 'Income'} records`}
            pdfSubtitle={`${expenses.length} entries`}
            pdfHeaders={exportHeaders}
            pdfRows={exportRows}
            disabled={loading || expenses.length === 0}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="grid md:grid-cols-[minmax(0,24rem)_12rem] gap-4 items-end">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Search</label>
            <input
              type="text"
              placeholder="Search records"
              value={searchTerm}
              onChange={handleSearchChange}
              className={controlClass}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Type</label>
            <select
              value={type}
              onChange={(e) => settype(e.target.value)}
              className={controlClass}
            >
              <option value="expense">EXPENSE</option>
              <option value="income">INCOME</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-left text-slate-600 text-xs uppercase tracking-wide">
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    Amount
                    <button type="button" className="text-slate-500 hover:text-primary" onClick={() => setSort(1)} aria-label="Sort amount ascending">
                      <ArrowUp size={15} />
                    </button>
                    <button type="button" className="text-slate-500 hover:text-primary" onClick={() => setSort(-1)} aria-label="Sort amount descending">
                      <ArrowDown size={15} />
                    </button>
                  </div>
                </th>
                <th className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    Date
                    <button type="button" className="text-slate-500 hover:text-primary" onClick={() => setDateSort(1)} aria-label="Sort date ascending">
                      <ArrowUp size={15} />
                    </button>
                    <button type="button" className="text-slate-500 hover:text-primary" onClick={() => setDateSort(-1)} aria-label="Sort date descending">
                      <ArrowDown size={15} />
                    </button>
                  </div>
                </th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Mode</th>
                <th className="px-5 py-4">Receipt</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-14 text-slate-500">Loading records...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-14 text-slate-500">No records found</td>
                </tr>
              ) : (
                expenses.map((ex) => (
                  <tr key={ex._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-950">{ex.title}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-xs truncate">{ex.description || 'No description'}</td>
                    <td className="px-5 py-4 text-primary font-bold">
                      ₹{parseFloat(type === 'expense' ? ex.amount : ex.income).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{new Date(ex.expenseDate).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-md text-sm bg-slate-100 border border-slate-200 text-slate-700">
                        {type === 'expense' ? ex.expCat?.catName?.toUpperCase() : ex.incomeCategory?.catName?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-md text-xs font-semibold border bg-slate-50 text-slate-600 border-slate-200">
                        {ex.paymentMode || '----'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {ex.expReceipt ? (
                        <a
                          href={ex.expReceipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium"
                        >
                          View <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(ex)}
                          className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 p-2 rounded-md transition-colors"
                          aria-label="Edit record"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteExpense(ex._id)}
                          className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 p-2 rounded-md transition-colors"
                          aria-label="Delete record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-950">Edit {type === 'expense' ? 'Expense' : 'Income'}</h3>
              <button type="button" onClick={closeEdit} className="text-slate-500 hover:text-slate-800" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input name="title" value={editForm.title} onChange={handleEditChange} className={controlClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input name="description" value={editForm.description} onChange={handleEditChange} className={controlClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input name="amount" type="number" min="0" step="0.01" value={editForm.amount} onChange={handleEditChange} className={controlClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input name="expenseDate" type="date" value={editForm.expenseDate} onChange={handleEditChange} className={controlClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="categoryId" value={editForm.categoryId} onChange={handleEditChange} className={controlClass}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.catName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment mode</label>
                <select name="paymentMode" value={editForm.paymentMode} onChange={handleEditChange} className={controlClass}>
                  <option value="CASH">CASH</option>
                  <option value="CARD">CARD</option>
                  <option value="UPI">UPI</option>
                  <option value="CHECK">CHECK</option>
                  <option value="EMI">EMI</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeEdit} className="flex-1 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
