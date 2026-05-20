import React, { useEffect, useState } from 'react'
import axios from '../api/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const GetMyCategories = () => {

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("expense")

  const navigate = useNavigate()

  // =========================
  // GET EXPENSE CATEGORIES
  // =========================
  const getAllCategories = async () => {

    try {

      const res = await axios.get("/expCat/userCategory")

      if (res.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data)
      } else {
        setCategories([])
      }

    } catch (err) {
      console.log(err)
      toast.error("Failed to load expense categories ❌")
    }
  }

  // =========================
  // GET INCOME CATEGORIES
  // =========================
  const getAllIncomeCategories = async () => {

    try {

      const res = await axios.get("/incomeCat/incomeCategory")

      if (res.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data)
      } else {
        setCategories([])
      }

    } catch (err) {
      console.log(err)
      toast.error("Failed to load income categories ❌")
    }
  }

  // =========================
  // USE EFFECT
  // =========================
  useEffect(() => {

    if (selectedCategory === "expense") {
      getAllCategories()
    } else {
      getAllIncomeCategories()
    }

  }, [selectedCategory])

  // =========================
  // DELETE CATEGORY
  // =========================
  const deleteCategory = async (id) => {

    const confirmDelete = window.confirm("Are you sure ?")

    if (!confirmDelete) return

    try {

      // EXPENSE DELETE
      if (selectedCategory === "expense") {

        await axios.delete(`/expCat/deletecat/${id}`)

      } else {

        // INCOME DELETE
        await axios.delete(`/incomeCat/deleteincomecat/${id}`)
      }

      // REMOVE FROM UI
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== id)
      )

      toast.success("Category deleted successfully ✅")

    } catch (err) {

      console.log(err)
      toast.error(
        err.response?.data?.message ||
        "Delete failed. Please login again and retry."
      )
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">
            Categories
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">
            My Categories
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Manage income and expense categories.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="px-3 py-2 bg-white text-slate-700 rounded-md text-sm border border-slate-200">
            Total: {categories.length}
          </span>

          <button
            onClick={() => navigate("/add-category")}
            className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Category Type
        </label>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-64 bg-white border border-slate-300 px-3 py-2 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
        >
          <option value="expense">EXPENSE</option>
          <option value="income">INCOME</option>
        </select>
      </div>

      {categories.length === 0 ? (
        <div className="text-center bg-white border border-dashed border-slate-300 rounded-lg py-16 text-slate-500">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-primary-200 transition-colors"
            >
              <h2 className="text-lg font-semibold text-slate-950 mb-2">
                {category.catName}
              </h2>

              <p className="text-slate-500 text-sm min-h-10 mb-5">
                {category.description || "No description"}
              </p>

              <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  ID: {category._id.slice(-5)}
                </span>

                <button
                  onClick={() => deleteCategory(category._id)}
                  className="px-3 py-1.5 text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
