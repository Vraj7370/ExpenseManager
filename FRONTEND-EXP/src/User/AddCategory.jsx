import React from "react";
import { useForm } from "react-hook-form";
import axios from "../api/axiosInstance";

export const AddCategory = () => {
  const { register, handleSubmit } = useForm();

  const submitHanlder = async (data) => {
    const res = await axios.post("/expCat/", data);
    console.log(res);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-slate-200">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Add New Category
          </h1>
          <p className="text-slate-500 mt-2">
            Create a new expense category for better tracking
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitHanlder)} className="space-y-6">
          {/* Category Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Category Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter category name"
              {...register("name")}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              placeholder="Enter category description"
              {...register("description")}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition duration-300"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};