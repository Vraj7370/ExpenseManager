import React, { useEffect, useState } from 'react'
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

ChartJS.register(
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
)

export const Report1 = () => {

  const [barData, setBarData] = useState({
    labels: [],
    datasets: []
  })

  const [isLoading, setIsLoading] = useState(true)

  const getMyExpenses = async () => {

    try {

      const res = await axiosInstance.get(`/exp/expbyuserid`)

      console.log(res.data.data)

      if (res.data && Array.isArray(res.data.data)) {

        const paymentData = {
          CASH: 0,
          CARD: 0,
          UPI: 0,
          CHECK: 0
        }

        res.data.data.map((exp) => {

          const paymentMode = exp.paymentMode
          const amount = Number(exp.amount)

          if (paymentData[paymentMode] !== undefined) {

            paymentData[paymentMode] += amount
          }
        })

        console.log(paymentData)

        const chartData = {

          labels: Object.keys(paymentData),

          datasets: [
            {
              label: "Payment Mode Amount",

              data: Object.values(paymentData),

              backgroundColor: [
                'rgba(251,191,36,0.7)',
                'rgba(59,130,246,0.7)',
                'rgba(168,85,247,0.7)',
                'rgba(239,68,68,0.7)',
              ],

              borderColor: [
                'rgba(251,191,36,1)',
                'rgba(59,130,246,1)',
                'rgba(168,85,247,1)',
                'rgba(239,68,68,1)',
              ],

              borderWidth: 2,
              borderRadius: 12,
              barThickness: 60,
            }
          ]
        }

        setBarData(chartData)
      }

    } catch (err) {

      console.error("Error fetching expenses", err)

    } finally {

      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMyExpenses()
  }, [])

  return (

    <div className="min-h-[calc(100vh-8rem)]">

      <div className="max-w-6xl mx-auto">

        {/* HEADING */}
        <div className="mb-8">

          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">
            Reports
          </p>

          <h1 className="text-3xl font-semibold text-slate-950 mb-3">
            Payment Mode Report
          </h1>

          <p className="text-slate-500">
            Expense analysis based on payment modes.
          </p>

        </div>

        {/* CARD */}
        <div className="rounded-lg p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">

          {isLoading ? (

            <div className="text-center text-slate-500 py-20">
              Loading Report...
            </div>

          ) : (

            <div className="w-full">

              <Bar
                data={barData}
                options={{
                  responsive: true,

                  plugins: {

                    legend: {
                      labels: {
                        color: '#334155'
                      }
                    }
                  },

                  scales: {

                    x: {

                      ticks: {
                        color: '#475569',
                        font: {
                          size: 14
                        }
                      },

                      grid: {
                        color: 'rgba(148,163,184,0.22)'
                      }
                    },

                    y: {

                      beginAtZero: true,

                      ticks: {
                        color: '#475569',
                        font: {
                          size: 14
                        }
                      },

                      grid: {
                        color: 'rgba(148,163,184,0.22)'
                      }
                    }
                  }
                }}
              />

            </div>
          )}

        </div>

      </div>

    </div>
  )
}
