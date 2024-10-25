"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import usersData from "@/data/users.json"
import { useAuth } from "@/app/context/AuthContext"

export default function LoginForm() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({})
    const router = useRouter()
    const { dispatch } = useAuth()

    const validateForm = () => {
        let tempErrors = {}

        // check if the email is empty
        if (!credentials.email) {
            tempErrors.email = "البريد الإلكتروني مطلوب"
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            tempErrors.email = "البريد الإلكتروني غير صالح"
        }

        // check if the password is empty
        if (!credentials.password) {
            tempErrors.password = "كلمة المرور مطلوبة"
        } else if (credentials.password.length < 6) {
            tempErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
        }

        setErrors(tempErrors)
        return Object.keys(tempErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }))
        // remove the error message when the user starts typing
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            const user = usersData.find(
                (u) =>
                    u.email === credentials.email &&
                    u.password === credentials.password
            )

            if (user) {
                dispatch({ type: "LOGIN", payload: user })
                router.push("/dashboard")
            } else {
                setErrors({
                    general: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
                })
            }
        }
    }

    return (
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md font-tajawal'>
            <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                تسجيل الدخول
            </h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                    <label
                        htmlFor='email'
                        className='block mb-2 font-bold text-gray-700'
                    >
                        البريد الإلكتروني:
                    </label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={credentials.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.email && (
                        <p className='mt-1 text-red-500 text-sm'>
                            {errors.email}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor='password'
                        className='block mb-2 font-bold text-gray-700'
                    >
                        كلمة المرور:
                    </label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={credentials.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.password
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errors.password && (
                        <p className='mt-1 text-red-500 text-sm'>
                            {errors.password}
                        </p>
                    )}
                </div>
                {errors.general && (
                    <p className='text-red-500 text-sm'>{errors.general}</p>
                )}
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300'
                >
                    تسجيل الدخول
                </button>
            </form>
        </div>
    )
}
