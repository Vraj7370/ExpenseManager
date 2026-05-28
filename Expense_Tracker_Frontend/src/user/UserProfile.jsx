import React, { useCallback, useEffect, useState, useRef } from 'react'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Camera, Edit2, X, Save } from 'lucide-react'

export const UserProfile = () => {

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [uploadingPic, setUploadingPic] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({})
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

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
            setEditData({
                firstName: res.data.data.firstName || "",
                lastName: res.data.data.lastName || "",
                age: res.data.data.age || "",
                gender: res.data.data.gender || ""
            })

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

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploadingPic(true)
            const formData = new FormData()
            formData.append("profilePic", file)

            const res = await axiosInstance.put("/user/uploadprofilepic", formData)

            if (res.status === 200) {
                toast.success("Profile picture updated")
                setUser(res.data.data)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload picture")
        } finally {
            setUploadingPic(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value })
    }

    const handleSaveProfile = async () => {
        try {
            const res = await axiosInstance.put("/user/profile", editData)
            if (res.status === 200) {
                toast.success("Profile updated successfully")
                setUser(res.data.data)
                setIsEditing(false)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile")
        }
    }

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

                <div className="px-6 sm:px-8 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                            <div className="relative group -mt-14 shrink-0">
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
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingPic}
                                    className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50"
                                    title="Edit Profile Picture"
                                >
                                    <Camera size={16} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="pb-1 sm:pt-2">
                                <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-1">
                                    Profile
                                </p>
                                <h1 className="text-3xl font-semibold text-slate-950 truncate max-w-full">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-slate-500 mt-1">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
                            >
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setEditData({
                                            firstName: user.firstName || "",
                                            lastName: user.lastName || "",
                                            age: user.age || "",
                                            gender: user.gender || ""
                                        })
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
                                >
                                    <X size={16} /> Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-slate-800 text-white font-medium rounded-md transition-colors"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mt-8">
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
                            <h2 className="text-lg font-semibold text-slate-950 mb-4">
                                Personal Information
                            </h2>

                            <div className="space-y-4 text-slate-600">
                                {isEditing ? (
                                    <>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase">First Name</label>
                                            <input type="text" name="firstName" value={editData.firstName} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
                                            <input type="text" name="lastName" value={editData.lastName} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong className="text-slate-900">First Name:</strong> {user.firstName}</p>
                                        <p><strong className="text-slate-900">Last Name:</strong> {user.lastName}</p>
                                    </>
                                )}
                                <p>
                                    <strong className="text-slate-900">Email:</strong> {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
                            <h2 className="text-lg font-semibold text-slate-950 mb-4">
                                Other Details
                            </h2>

                            <div className="space-y-4 text-slate-600">
                                {isEditing ? (
                                    <>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Age</label>
                                            <input type="number" name="age" value={editData.age} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
                                            <select name="gender" value={editData.gender} onChange={handleEditChange} className="w-full mt-1 p-2 border rounded-md focus:ring-primary focus:border-primary bg-white">
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong className="text-slate-900">Age:</strong> {user.age || "Not Added"}</p>
                                        <p><strong className="text-slate-900">Gender:</strong> {user.gender || "N/A"}</p>
                                    </>
                                )}
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
