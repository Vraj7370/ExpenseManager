import React, { useEffect, useMemo, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { toast } from 'react-toastify'
import { ExportButtons } from '../components/ExportButtons'

ChartJS.register(ArcElement, Tooltip, Legend)

const SUMMARY_HEADERS = ['Category', 'Amount (₹)']

export const Report = () => {
  const [data, setData] = useState({ labels: [], datasets: [] })
  const [summaryRows, setSummaryRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const totalAmount = useMemo(
    () => summaryRows.reduce((sum, row) => sum + Number(row[1] || 0), 0),
    [summaryRows]
  )

  const getMyExpenses = async () => {
    try {
      const res = await axiosInstance.get('/exp/expbyuserid?type=expense')

      if (res.data && Array.isArray(res.data.data)) {
        const groupedData = {}

        res.data.data.forEach((exp) => {
          const category = exp.expCat?.catName || 'No Category'
          const amount = Number(exp.amount) || 0
          groupedData[category] = (groupedData[category] || 0) + amount
        })

        const rows = Object.entries(groupedData).map(([cat, amt]) => [cat, amt.toFixed(2)])
        setSummaryRows(rows)

        setData({
          labels: Object.keys(groupedData),
          datasets: [
            {
              label: 'Expense Amount',
              data: Object.values(groupedData),
              backgroundColor: [
                'rgba(50, 101, 80, 0.7)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderWidth: 2,
            },
          ],
        })
      } else {
        setSummaryRows([])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load report')
      setSummaryRows([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMyExpenses()
  }, [])

  const csvRows = [SUMMARY_HEADERS, ...summaryRows]
  const dateSlug = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl rounded-lg p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Reports</p>
            <h1 className="text-3xl font-semibold text-slate-950 mb-2">Expense Report</h1>
            <p className="text-slate-500">Category wise expense analysis.</p>
          </div>
          <ExportButtons
            filename={`expense-by-category-${dateSlug}`}
            csvRows={csvRows}
            pdfTitle="Expense by category"
            pdfSubtitle="Category summary"
            pdfHeaders={SUMMARY_HEADERS}
            pdfRows={summaryRows}
            pdfSummaryLines={[`Total: ₹${totalAmount.toLocaleString('en-IN')}`]}
            disabled={isLoading || summaryRows.length === 0}
          />
        </div>

        {isLoading ? (
          <div className="text-center text-slate-500 py-20">Loading report...</div>
        ) : summaryRows.length === 0 ? (
          <div className="text-center text-slate-500 py-20">No expense data to show.</div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              <Pie data={data} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
