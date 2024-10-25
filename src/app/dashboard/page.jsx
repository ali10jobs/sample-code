"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import CreateTaskForm from "@/app/components/CreateTaskForm"

export default function Dashboard() {
    const { state, dispatch } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!state.isAuthenticated) {
            router.push("/")
        }
    }, [state.isAuthenticated, router])

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" })
        router.push("/")
    }

    const handleCreateTask = (newTask) => {
        // Here you can add logic to save the new task
        console.log("New task:", newTask)
    }

    if (!state.isAuthenticated) {
        return null
    }

    return (
        <div className='min-h-screen bg-gray-100 font-tajawal'>
            {/* Navbar */}
            <nav className='bg-white shadow-md'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex-shrink-0'>
                            <h1 className='text-xl font-bold'>لوحة التحكم</h1>
                        </div>
                        <div>
                            <button
                                onClick={handleLogout}
                                className='text-gray-400 font-bold py-2 px-4 rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300'
                            >
                                تسجيل الخروج
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
                <div className='px-4 py-6 sm:px-0'>
                    <div className='mt-8'>
                        <CreateTaskForm onCreateTask={handleCreateTask} />
                    </div>
                </div>
            </main>
        </div>
    )
}
