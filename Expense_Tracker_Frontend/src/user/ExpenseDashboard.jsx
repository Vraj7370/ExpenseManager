import React from 'react'

export const ExpenseDashboard = () => {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
        <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">
          Overview
        </p>
        <h1 className="text-3xl font-semibold text-slate-950">
          Expense Dashboard
        </h1>
        <p className="text-slate-500 mt-3 max-w-2xl">
          Track categories, add income or expense records, and review reports from the navigation above.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Records</h2>
          <p className="text-sm text-slate-500 mt-2">
            Add and manage income or expense entries.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Categories</h2>
          <p className="text-sm text-slate-500 mt-2">
            Keep your finance categories organized.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Reports</h2>
          <p className="text-sm text-slate-500 mt-2">
            Review category and payment mode summaries.
          </p>
        </div>
      </section>
    </div>
  )
}
