import axios from './axiosInstance'

export const fetchBudgets = (withUsage = true) =>
  axios.get(withUsage ? '/budget?usage=true' : '/budget')

export const fetchBudgetById = (id, withUsage = true) =>
  axios.get(`/budget/${id}${withUsage ? '?usage=true' : ''}`)

export const createBudget = (payload) => axios.post('/budget/', payload)

export const updateBudget = (id, payload) =>
  axios.put(`/budget/update/${id}`, payload)

export const deleteBudget = (id) => axios.delete(`/budget/delete/${id}`)
