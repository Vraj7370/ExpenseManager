import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import {Chart as ChartJS,ArcElement,Tooltip,Legend
} from 'chart.js'

import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export const Report = () => {

  const [data, setData] = useState({
    labels: [],
    datasets: []
  })

  const [isLoading, setIsLoading] = useState(true)

  const getMyExpenses = async () => {

    try {

      const res = await axiosInstance.get(`/exp/expbyuserid`)

      console.log(res.data.data)

      if (res.data && Array.isArray(res.data.data)) {

        // CATEGORY WISE TOTAL
        const groupedData = {}

        res.data.data.forEach((exp) => {

          const category =
            exp.expCat?.catName || "No Category"

          const amount = Number(exp.amount)

          if (groupedData[category]) {

            groupedData[category] += amount

          } else {

            groupedData[category] = amount
          }
        })

        console.log(groupedData)

        const chartData = {

          labels: Object.keys(groupedData),

          datasets: [
            {
              label: "Expense Amount",

              data: Object.values(groupedData),

              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(16, 185, 129, 0.6)',
                'rgba(244, 63, 94, 0.6)',
              ],

              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(244, 63, 94, 1)',
              ],

              borderWidth: 2,
            }
          ]
        }

        setData(chartData)
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

    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">

      <div className="w-full max-w-4xl rounded-lg p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">

        {/* HEADING */}
        <div className="mb-8">

          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">
            Reports
          </p>

          <h1 className="text-3xl font-semibold text-slate-950 mb-2">
            Expense Report
          </h1>

          <p className="text-slate-500">
            Category wise expense analysis.
          </p>

        </div>

        {/* LOADING */}
        {isLoading ? (

          <div className="text-center text-slate-500 py-20">
            Loading Report...
          </div>

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
