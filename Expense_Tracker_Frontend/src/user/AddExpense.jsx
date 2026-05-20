import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  Wallet,
  IndianRupee,
  CalendarDays,
  Receipt,
  FileText,
  Layers3
} from 'lucide-react'

export const AddExpense = () => {

  const {
    register,
    handleSubmit,
    reset
  } = useForm()

  const [categories, setCategories] = useState([])
  const [selectedFile, setSelectedFile] = useState("")
  const [selectedType, setSelectedType] = useState("expense")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // ================= CATEGORY =================

  const getMyExpCategories = async () => {
    try {

      const res = await axiosInstance.get("/expCat/userCategory")

      setCategories(res.data.data)

    } catch (err) {

      toast.error("Failed to load expense categories")
    }
  }

  const getMyIncomeCategories = async () => {
    try {

      const res = await axiosInstance.get("/incomeCat/incomeCategory")

      setCategories(res.data.data)

    } catch (err) {

      toast.error("Failed to load income categories")
    }
  }

  useEffect(() => {

    if (selectedType === "expense") {
      getMyExpCategories()
    } else {
      getMyIncomeCategories()
    }

  }, [selectedType])

  // ================= SUBMIT =================

  const submitHandler = async (data) => {

    try {

      setLoading(true)

      if (selectedType === "income") {
        data.income = Number(data.amount)
        delete data.amount

        data.incomeCategory = data.expCat
        delete data.expCat
      } else {
        data.amount = Number(data.amount)
      }

      const res = await axiosInstance.post("/exp/", data)

      if (res.status === 201) {

        if (selectedFile) {

          const formData = new FormData()

          formData.append(
            "expId",
            res.data.data._id
          )

          formData.append(
            "receipt",
            selectedFile
          )

          const res2 = await axiosInstance.put(
            "/exp/uploadreceipt",
            formData
          )

          if (res2.status === 200) {

            toast.success(
              `${selectedType} added with receipt ✅`
            )

          } else {

            toast.warning(
              `${selectedType} added but receipt upload failed`
            )
          }

        } else {

          toast.success(
            `${selectedType} added successfully ✅`
          )
        }

        reset()

        navigate("/my-expenses")
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Something went wrong ❌"
      )

    } finally {

      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 sm:px-8 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-primary-50 text-primary flex items-center justify-center border border-primary-100">
                <Wallet size={24} />
              </div>

              <div>
                <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-1">
                  New Record
                </p>
                <h1 className="text-3xl font-semibold text-slate-950">
                  Add {selectedType === "expense" ? "Expense" : "Income"}
                </h1>
                <p className="text-slate-500 mt-2">
                  Keep the details simple and accurate for reporting.
                </p>
              </div>
            </div>

            <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1 self-start">
              <button
                type="button"
                onClick={() => setSelectedType("expense")}
                className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                  selectedType === "expense"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Expense
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("income")}
                className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                  selectedType === "income"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Income
              </button>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="p-6 sm:p-8 space-y-6"
        >
          <div>
            <label className="text-sm font-medium mb-2 text-slate-700 flex items-center gap-2">
              <Receipt size={16} />
              Title
            </label>

            <input
              type="text"
              placeholder={`Enter ${selectedType} title`}
              {...register("title")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 text-slate-700 flex items-center gap-2">
              <FileText size={16} />
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Enter details"
              {...register("description")}
              className={inputClass}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-2 text-slate-700 flex items-center gap-2">
                <IndianRupee size={16} />
                Amount
              </label>

              <input
                type="number"
                placeholder="Enter amount"
                {...register("amount")}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-slate-700 flex items-center gap-2">
                <CalendarDays size={16} />
                Date
              </label>

              <input
                type="date"
                {...register("expenseDate")}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-2 text-slate-700 flex items-center gap-2">
                <Layers3 size={16} />
                Category
              </label>

              <select
                {...register("expCat")}
                className={inputClass}
              >
                <option value="">
                  Select Category
                </option>

                {
                  categories?.map((cat) => (

                    <option
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.catName}
                    </option>

                  ))
                }
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-slate-700 block">
                Payment Mode
              </label>

              <select
                {...register("paymentMode")}
                className={inputClass}
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="CHECK">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 text-slate-700 block">
              Upload Receipt
            </label>

            <input
              type="file"
              onChange={(event) =>
                setSelectedFile(event.target.files[0])
              }
              className={inputClass}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold transition-colors shadow-sm disabled:opacity-60"
            >
              {
                loading
                  ? "Processing..."
                  : `Add ${selectedType}`
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
