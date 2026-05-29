import React, { useCallback, useEffect, useState } from 'react'
import axios from '../api/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, X } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { StateCard } from '../components/StateCard'

const emptyEditForm = {
  catName: '',
  description: ''
}

export const GetMyCategories = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('expense')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState(emptyEditForm)
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate()

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true)
      const url =
        selectedCategory === 'expense'
          ? '/expCat/userCategory'
          : '/incomeCat/incomeCategory'

      const res = await axios.get(url)

      if (res.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data)
      } else {
        setCategories([])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const openEdit = (category) => {
    setEditing(category)
    setEditForm({
      catName: category.catName || '',
      description: category.description || ''
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

    const catName = editForm.catName.trim()
    if (!catName) {
      toast.error('Category name is required')
      return
    }

    try {
      setSaving(true)
      const payload = {
        catName,
        description: editForm.description.trim()
      }

      const url =
        selectedCategory === 'expense'
          ? `/expCat/updatecat/${editing._id}`
          : `/incomeCat/updateincomecat/${editing._id}`

      const res = await axios.put(url, payload)

      const updated = res.data?.data
      if (updated) {
        setCategories((prev) =>
          prev.map((cat) => (cat._id === editing._id ? updated : cat))
        )
      }

      toast.success('Category updated successfully')
      closeEdit()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category')
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm('Delete this category?')
    if (!confirmDelete) return

    try {
      setDeletingId(id)

      if (selectedCategory === 'expense') {
        await axios.delete(`/expCat/deletecat/${id}`)
      } else {
        await axios.delete(`/incomeCat/deleteincomecat/${id}`)
      }

      setCategories((prev) => prev.filter((cat) => cat._id !== id))
      toast.success('Category deleted successfully')
    } catch (err) {
      console.error(err)
      toast.error(
        err.response?.data?.message ||
          'Delete failed. Please login again and retry.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const typeLabel = selectedCategory === 'expense' ? 'Expense' : 'Income'

  return (
    <div>
      <PageHeader
        eyebrow="Categories"
        title="My Categories"
        subtitle="Manage income and expense categories."
        right={
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="px-3 py-2 bg-white text-slate-700 rounded-md text-sm border border-slate-200">
              Total: {categories.length}
            </span>
            <button
              type="button"
              onClick={() => navigate('/add-category')}
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
            >
              + Add
            </button>
          </div>
        }
      />

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Category Type
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-64 bg-white border border-slate-300 px-3 py-2 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {loading ? (
        <StateCard
          variant="loading"
          title="Loading categories..."
          description="Fetching your latest categories."
        />
      ) : categories.length === 0 ? (
        <StateCard
          variant="empty"
          title="No categories yet"
          description={`Create your first ${typeLabel.toLowerCase()} category.`}
          action={
            <button
              type="button"
              onClick={() => navigate('/add-category')}
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
            >
              + Add Category
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-primary-200 transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-slate-950 truncate">
                    {category.catName}
                  </h2>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {typeLabel}
                  </span>
                </div>
              </div>

              <p className="text-slate-500 text-sm flex-1 line-clamp-3 mb-4">
                {category.description?.trim() || 'No description'}
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openEdit(category)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(category._id)}
                  disabled={deletingId === category._id}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 transition-colors disabled:opacity-60"
                >
                  <Trash2 size={13} />
                  {deletingId === category._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-slate-950">Edit Category</h3>
              <button
                type="button"
                onClick={closeEdit}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="catName"
                  value={editForm.catName}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Optional description"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-60"
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
