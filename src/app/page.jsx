"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "./components/LoginForm"
import { useAuth } from "./context/AuthContext"

export default function Home() {
    const router = useRouter()
    const { state } = useAuth()

    useEffect(() => {
        // check if there is a stored user or authenticated user
        const storedUser = localStorage.getItem("user")
        if (storedUser || state.isAuthenticated) {
            router.push("/dashboard")
        }
    }, [router, state.isAuthenticated])

    return (
        <main className='flex items-center justify-center min-h-screen bg-gray-100'>
            <LoginForm />
        </main>
    )
}
