import React from 'react'
import { useForm } from 'react-hook-form'
import axios from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, FolderPlus } from 'lucide-react'

export const AddCategory = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const navigate = useNavigate()

  // =========================
  // SUBMIT
  // =========================
  const submitHandler = async (data) => {

    try {

      console.log("data...", data)

      // EXPENSE
      if (data.type === "expense") {

        const res = await axios.post("/expCat/", data)

        console.log(res)

        toast.success("Expense category added ✅")
      }

      // INCOME
      if (data.type === "income") {

        const res = await axios.post("/incomeCat/", data)

        console.log(res)

        toast.success("Income category added ✅")
      }

      reset()

      // NAVIGATE
      navigate("/my-categories")

    } catch (err) {

      console.log(err)

      toast.error("Failed to add category ❌")
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
        <button
          onClick={() => navigate("/my-categories")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Categories
        </button>

        <div className="flex items-start gap-4 mb-8">
          <div className="h-12 w-12 rounded-md bg-primary-50 text-primary flex items-center justify-center border border-primary-100">
            <FolderPlus size={24} />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-1">
              Category Setup
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Add Category
            </h1>
            <p className="text-slate-500 mt-2">
              Create a simple category for income or expenses.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category Type
            </label>

            <select
              {...register("type", {
                required: {
                  value: true,
                  message: "Please select category type"
                }
              })}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="">-- Select Type --</option>
              <option value="expense">EXPENSE</option>
              <option value="income">INCOME</option>
            </select>

            {errors.type && (
              <p className="text-red-600 text-sm mt-2">
                {errors.type.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              {...register("catName", {
                required: "Category name is required"
              })}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />

            {errors.catName && (
              <p className="text-red-600 text-sm mt-2">
                {errors.catName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Write description"
              {...register("description")}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold transition-colors shadow-sm active:translate-y-px"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  )
}
