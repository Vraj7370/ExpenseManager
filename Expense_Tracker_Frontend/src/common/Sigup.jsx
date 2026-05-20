import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from '../api/axiosInstance'

export const Sigup = () => {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    setServerError('')

    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      ...(data.age ? { age: Number(data.age) } : {}),
      ...(data.gender ? { gender: data.gender } : {}),
    }

    try {
      const res = await axios.post('/user/signup', payload)

      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        document.cookie = `token=${res.data.token}; path=/; sameSite=Lax`
      }

      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Expense Tracker</p>
          <h2 className="text-3xl font-semibold text-text-base mb-2">Create your account</h2>
          <p className="text-text-muted">Start tracking expenses with your own secure profile.</p>
        </div>

        {serverError && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors ${
                  errors.firstName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="First name"
                {...register('firstName', {
                  required: 'First name is required',
                  validate: (value) => value.trim().length > 0 || 'First name is required',
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors ${
                  errors.lastName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Last name"
                {...register('lastName', {
                  required: 'Last name is required',
                  validate: (value) => value.trim().length > 0 || 'Last name is required',
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-base mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must have at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="age">
                Age
              </label>
              <input
                id="age"
                type="number"
                className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors ${
                  errors.age ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Optional"
                {...register('age', {
                  min: {
                    value: 1,
                    message: 'Age must be greater than 0',
                  },
                })}
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors"
                defaultValue=""
                {...register('gender')}
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary-300 text-white font-medium py-3 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 active:translate-y-px"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
