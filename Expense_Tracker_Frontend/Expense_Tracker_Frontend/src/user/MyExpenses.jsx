import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

export const MyExpenses = () => {

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState(1)
  const [dateSort, setDateSort] = useState(1)
  const [type, settype] = useState("expense")

  // GET DATA
  const getMyExpenses = async () => {

    try {

      const res = await axiosInstance.get(
        `/exp/expbyuserid?sort=${sort}&date=${dateSort}&type=${type}`
      )

      if (res.data && Array.isArray(res.data.data)) {

        setExpenses(res.data.data)

      } else {

        setExpenses([])
      }

    } catch (err) {

      console.error(err)
      toast.error("Failed to load data ❌")

    } finally {

      setLoading(false)
    }
  }

  // SEARCH
  const searchHanlder = async (e) => {

    try {

      const res = await axiosInstance.get(
        "/exp/search?expName=" + e.target.value
      )

      if (res.data && Array.isArray(res.data.data)) {

        setExpenses(res.data.data)

      } else {

        setExpenses([])
      }

    } catch (err) {

      console.error(err)
      toast.error("Search failed ❌")
    }
  }

  // DELETE
  const deleteExpense = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    )

    if (!confirmDelete) return

    try {

      await axiosInstance.delete(`/exp/delete/${id}`)

      setExpenses((prev) =>
        prev.filter((exp) => exp._id !== id)
      )

      toast.success("Deleted successfully ✅")

    } catch (err) {

      console.error(err)
      toast.error(
        err.response?.data?.message ||
        "Delete failed. Please login again and retry."
      )
    }
  }

  useEffect(() => {

    getMyExpenses()

  }, [sort, dateSort, type])

  const controlClass = "w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">
            Ledger
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">
            My {type === "expense" ? "Expenses" : "Income"}
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Search, sort, and manage your financial records.
          </p>
        </div>

        <div className="px-3 py-2 rounded-md text-sm border border-slate-200 bg-white text-slate-700">
          Total: {expenses.length}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="grid md:grid-cols-[minmax(0,24rem)_12rem] gap-4 items-end">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Search
            </label>

            <input
              type="text"
              placeholder="Search records"
              onChange={(e) => searchHanlder(e)}
              className={controlClass}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Type
            </label>

            <select
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
          <table className="w-full min-w-[920px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-left text-slate-600 text-xs uppercase tracking-wide">
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    Amount

                    <button
                      className="text-slate-500 hover:text-primary transition-colors"
                      onClick={() => setSort(1)}
                      aria-label="Sort amount ascending"
                    >
                      <ArrowUp size={15} />
                    </button>

                    <button
                      className="text-slate-500 hover:text-primary transition-colors"
                      onClick={() => setSort(-1)}
                      aria-label="Sort amount descending"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </div>
                </th>

                <th className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    Date

                    <button
                      className="text-slate-500 hover:text-primary transition-colors"
                      onClick={() => setDateSort(1)}
                      aria-label="Sort date ascending"
                    >
                      <ArrowUp size={15} />
                    </button>

                    <button
                      className="text-slate-500 hover:text-primary transition-colors"
                      onClick={() => setDateSort(-1)}
                      aria-label="Sort date descending"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </div>
                </th>

                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Mode</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-14 text-slate-500"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-14 text-slate-500"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                expenses.map((ex) => (
                  <tr
                    key={ex._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-950">
                      {ex.title}
                    </td>

                    <td className="px-5 py-4 text-slate-500 max-w-xs truncate">
                      {ex.description || "No description"}
                    </td>

                    <td className="px-5 py-4 text-primary font-bold">
                      ₹{
                        parseFloat(
                          type === "expense"
                            ? ex.amount
                            : ex.income
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2
                        })
                      }
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {new Date(ex.expenseDate).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-md text-sm bg-slate-100 border border-slate-200 text-slate-700">
                        {
                          type === "expense"
                            ? ex.expCat?.catName?.toUpperCase()
                            : ex.incomeCategory?.catName?.toUpperCase()
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                        ex.paymentMode === 'CASH'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : ex.paymentMode === 'CARD'
                          ? 'bg-sky-50 text-sky-700 border-sky-100'
                          : ex.paymentMode === 'UPI'
                          ? 'bg-violet-50 text-violet-700 border-violet-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {ex.paymentMode || "----"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => deleteExpense(ex._id)}
                        className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 p-2 rounded-md transition-colors"
                        aria-label="Delete record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
