import React from 'react'
import { useForm } from 'react-hook-form'
import axios from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const AddCategory = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const navigate = useNavigate()

    const submitHandler = async (data) => {
        try {
            const res = await axios.post("/expCat/", data)

            if (res.status === 201 || res.status === 200) {
                toast.success("Category Added Successfully")

                reset()

                setTimeout(() => {
                    navigate("/my-categories")
                }, 1000)
            }

        } catch (error) {
            console.error(error)

            if (error.response) {
                toast.error(error.response.data.message || "Something went wrong")
            } else {
                toast.error("Server not responding")
            }
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-[var(--color-bg-muted)] p-6 rounded-xl shadow">

            <h1 className="text-2xl font-semibold mb-6 text-[var(--color-text-base)]">
                Add Category
            </h1>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

                {/* Category Name */}
                <div className="text-left">
                    <label className="block mb-1 text-sm text-[var(--color-text-muted)]">
                        Category Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter category name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        {...register("catName", {
                            required: "Category name is required"
                        })}
                    />

                    {errors.catName && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.catName.message}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="text-left">
                    <label className="block mb-1 text-sm text-[var(--color-text-muted)]">
                        Description
                    </label>

                    <input
                        type="text"
                        placeholder="Enter description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        {...register("description", {
                            required: "Description is required"
                        })}
                    />

                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-2 rounded-md text-white font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition"
                >
                    Add Category
                </button>

            </form>

        </div>
    )
}