import React, { useEffect, useMemo, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { toast } from 'react-toastify'
import { ExportButtons } from '../components/ExportButtons'

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const PAYMENT_KEYS = ['CASH', 'CARD', 'UPI', 'CHECK', 'EMI']
const SUMMARY_HEADERS = ['Payment mode', 'Amount (₹)']

export const Report1 = () => {
  const [barData, setBarData] = useState({ labels: [], datasets: [] })
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
        const paymentData = {}
        PAYMENT_KEYS.forEach((k) => {
          paymentData[k] = 0
        })

        res.data.data.forEach((exp) => {
          const mode = exp.paymentMode || 'OTHER'
          const amount = Number(exp.amount) || 0
          if (paymentData[mode] !== undefined) {
            paymentData[mode] += amount
          } else {
            paymentData[mode] = (paymentData[mode] || 0) + amount
          }
        })

        const filtered = Object.entries(paymentData).filter(([, amt]) => amt > 0)
        const rows = filtered.map(([mode, amt]) => [mode, amt.toFixed(2)])
        setSummaryRows(rows)

        setBarData({
          labels: filtered.map(([k]) => k),
          datasets: [
            {
              label: 'Payment mode amount',
              data: filtered.map(([, v]) => v),
              backgroundColor: 'rgba(50, 101, 80, 0.65)',
              borderColor: 'rgba(50, 101, 80, 1)',
              borderWidth: 2,
              borderRadius: 8,
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
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Reports</p>
            <h1 className="text-3xl font-semibold text-slate-950 mb-3">Payment Mode Report</h1>
            <p className="text-slate-500">Expense analysis based on payment modes.</p>
          </div>
          <ExportButtons
            filename={`expense-by-payment-${dateSlug}`}
            csvRows={csvRows}
            pdfTitle="Expense by payment mode"
            pdfSubtitle="Payment mode summary"
            pdfHeaders={SUMMARY_HEADERS}
            pdfRows={summaryRows}
            pdfSummaryLines={[`Total: ₹${totalAmount.toLocaleString('en-IN')}`]}
            disabled={isLoading || summaryRows.length === 0}
          />
        </div>

        <div className="rounded-lg p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
          {isLoading ? (
            <div className="text-center text-slate-500 py-20">Loading report...</div>
          ) : summaryRows.length === 0 ? (
            <div className="text-center text-slate-500 py-20">No expense data to show.</div>
          ) : (
            <div className="w-full">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { labels: { color: '#334155' } },
                  },
                  scales: {
                    x: {
                      ticks: { color: '#475569' },
                      grid: { color: 'rgba(148,163,184,0.22)' },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { color: '#475569' },
                      grid: { color: 'rgba(148,163,184,0.22)' },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
