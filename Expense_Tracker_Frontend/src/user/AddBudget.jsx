import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, Wallet } from 'lucide-react'
import { createBudget } from '../api/budgetService'

const toDateInput = (date = new Date()) => {
  const d = new Date(date)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().split('T')[0]
}

export const AddBudget = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      maxAmount: '',
      createdDate: toDateInput(),
      endDate: '',
      budgetStatus: 'active'
    }
  })

  const submitHandler = async (data) => {
    try {
      const payload = {
        maxAmount: Number(data.maxAmount),
        createdDate: data.createdDate || undefined,
        endDate: data.endDate || undefined,
        budgetStatus: data.budgetStatus
      }

      await createBudget(payload)
      toast.success('Budget created successfully')
      navigate('/my-budgets')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create budget')
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
        <button
          type="button"
          onClick={() => navigate('/my-budgets')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Budgets
        </button>

        <div className="flex items-start gap-4 mb-8">
          <div className="h-12 w-12 rounded-md bg-primary-50 text-primary flex items-center justify-center border border-primary-100">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-1">
              Budget
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">Add Budget</h1>
            <p className="text-slate-500 mt-2">
              Set a spending limit and track expenses against it.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g. 10000"
              {...register('maxAmount', {
                required: 'Max amount is required',
                min: { value: 1, message: 'Amount must be greater than 0' }
              })}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
            {errors.maxAmount && (
              <p className="text-red-600 text-sm mt-2">{errors.maxAmount.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                {...register('createdDate', { required: 'Start date is required' })}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              />
              {errors.createdDate && (
                <p className="text-red-600 text-sm mt-2">{errors.createdDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date (optional)
              </label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              {...register('budgetStatus', { required: true })}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="active">Active</option>
              <option value="not active">Not Active</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold transition-colors shadow-sm disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Create Budget'}
          </button>
        </form>
      </div>
    </div>
  )
}
