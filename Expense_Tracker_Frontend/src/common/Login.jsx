//import axios from 'axios';
import { useForm } from 'react-hook-form';
import axios from "../api/axiosInstance"
import { useLocation, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/auth';

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async(data) => {
    
    console.log('Login Data:', data);
    const res = await axios.post("/user/login",data)
    console.log(res)

    // Store token in localStorage (standard for JWT Bearer tokens)
    console.log(res.data.token)
    setAuthToken(res.data.token);

      if(res.status==200){
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
    else{
      alert("loagin failed..")
    }

  };

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Expense Tracker</p>
          <h2 className="text-3xl font-semibold text-text-base mb-2">Welcome back</h2>
          <p className="text-text-muted">Sign in to continue managing your records.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  message: 'Entered value does not match email format'
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
            )}
          </div>

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
                  message: 'Password must have at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-white text-primary focus:ring-primary-300 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-hover transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 active:translate-y-px"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          Don't have an account?{' '}
          <a href="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};
