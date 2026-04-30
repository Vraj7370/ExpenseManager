import React, { useEffect, useState } from 'react'
import axios from '../api/axiosInstance'
import { toast } from 'react-toastify'

export const GetMyCategories = () => {

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)


  const getAllCategories = async () => {
    try {
      const res = await axios.get("/expCat/userCategory")
      setCategories(res.data.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete?")
      if (!confirmDelete) return

      const res = await axios.delete(`/expCat/deletemycat/${id}`)

      if (res.status === 200) {
        toast.success("Category Deleted Successfully")

        getAllCategories()
      }

    } catch (error) {
      console.error(error)
      toast.error("Error while deleting")
    }
  }

  // 🔹 CALL ON LOAD
  useEffect(() => {
    getAllCategories()
  }, [])

  return (
    <div className="max-w-6xl mx-auto mt-10">

      <h1 className="text-2xl font-semibold mb-6 text-[var(--color-text-base)]">
        My Categories
      </h1>

      {/* 🔹 Loading */}
      {loading && (
        <p className="text-[var(--color-text-muted)]">Loading...</p>
      )}

      {/* 🔹 Empty */}
      {!loading && categories.length === 0 && (
        <p className="text-[var(--color-text-muted)]">No categories found</p>
      )}

      {/* 🔹 Cards */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-[var(--color-bg-muted)] p-5 rounded-xl shadow hover:shadow-md transition border border-gray-200"
            >

              {/* Title */}
              <h2 className="text-lg font-semibold text-[var(--color-text-base)] mb-2">
                {category.catName}
              </h2>

              {/* Description */}
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                {category.description}
              </p>

              {/* ID */}
              <p className="text-xs text-gray-400 mb-4">
                ID: {category._id}
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-2">

                <button
                  onClick={() => handleDelete(category._id)}
                  className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200"
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