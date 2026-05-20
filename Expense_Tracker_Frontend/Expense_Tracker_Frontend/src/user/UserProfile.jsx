import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const UserProfile = () => {

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const getProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                toast.error("Please login first")
                navigate("/login")
                return
            }

            const res = await axiosInstance.get("/user/profile")

            setUser(res.data.data)

        } catch (error) {

            console.log(error)

            if (error.response?.status === 401) {
                localStorage.removeItem("token")
                document.cookie = "token=; path=/; max-age=0"
                toast.error("Session expired. Please login again.")
                navigate("/login")
                return
            }

            toast.error(error.response?.data?.message || "Failed to load profile")

        } finally {
            setLoading(false)
        }
    }, [navigate])

    useEffect(() => {
        getProfile()
    }, [getProfile])

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-xl font-semibold text-slate-700">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="h-28 bg-slate-900"></div>

                <div className="px-6 sm:px-8 pb-8 -mt-14">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                            {
                                user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt="profile"
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm bg-white"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-primary-50 text-primary text-4xl font-semibold flex justify-center items-center border-4 border-white shadow-sm">
                                        {user.firstName?.charAt(0)}
                                    </div>
                                )
                            }

                            <div className="pb-1">
                                <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-1">
                                    Profile
                                </p>
                                <h1 className="text-3xl font-semibold text-slate-950">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-slate-500 mt-1">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mt-8">
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
                            <h2 className="text-lg font-semibold text-slate-950 mb-4">
                                Personal Information
                            </h2>

                            <div className="space-y-3 text-slate-600">
                                <p>
                                    <strong className="text-slate-900">First Name:</strong> {user.firstName}
                                </p>

                                <p>
                                    <strong className="text-slate-900">Last Name:</strong> {user.lastName}
                                </p>

                                <p>
                                    <strong className="text-slate-900">Email:</strong> {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
                            <h2 className="text-lg font-semibold text-slate-950 mb-4">
                                Other Details
                            </h2>

                            <div className="space-y-3 text-slate-600">
                                <p>
                                    <strong className="text-slate-900">Age:</strong> {user.age || "Not Added"}
                                </p>

                                <p>
                                    <strong className="text-slate-900">Gender:</strong> {user.gender || "N/A"}
                                </p>

                                <p>
                                    <strong className="text-slate-900">Role:</strong> {user.role || "User"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
