"use client"
import { useState, useEffect } from "react"
import usersData from "@/data/users.json"
import { useAuth } from "@/app/context/AuthContext"
import useValidate from "@/app/hooks/useValidate"

const CreateTaskForm = () => {
    const priorityOptions = ["منخفضة", "متوسطة", "عالية"]
    const [employees, setEmployees] = useState([])
    const { state } = useAuth()
    const { errors, validateField, validateAllFields } = useValidate()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showMessage, setShowMessage] = useState(false)

    const [task, setTask] = useState({
        title: "",
        description: "",
        priority: "",
        assignedTo: "",
        dueDate: "",
        startDate: "",
        estimatedTime: "",
        comments: "",
        createdBy: "",
        lastUpdatedBy: "",
    })

    useEffect(() => {
        if (state.user) {
            const filteredEmployees = usersData.filter(
                (user) => user.managerId === state.user.id
            )
            setEmployees(filteredEmployees)
        }
    }, [state.user])

    useEffect(() => {
        if (isSubmitted) {
            setShowMessage(true)
            const timer = setTimeout(() => {
                setShowMessage(false)
                setIsSubmitted(false) // set to false to reset the form
            }, 5000) // hide the message after 5 seconds
            return () => clearTimeout(timer)
        }
    }, [isSubmitted])

    const handleChange = (e) => {
        const { name, value } = e.target
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }))
        validateField(name, value, task)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateAllFields(task)) {
            const trimmedTask = {
                ...task,
                description: task.description.trim(),
                comments: task.comments.trim(),
                createdBy: state.user?.id || "unknown",
                lastUpdatedBy: state.user?.id || "unknown",
            }

            try {
                const response = await fetch("/api/tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(trimmedTask),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(
                        `فشل في إرسال المهمة: ${
                            errorData.message || response.statusText
                        }`
                    )
                }

                const result = await response.json()
                //console.log("created successfully:", result.task)
                setIsSubmitted(true)
                // reset the form
                setTask({
                    title: "",
                    description: "",
                    priority: "",
                    assignedTo: "",
                    dueDate: "",
                    startDate: "",
                    estimatedTime: "",
                    comments: "",
                    createdBy: "",
                    lastUpdatedBy: "",
                })
            } catch (error) {
                console.error("خطأ في إرسال المهمة:", error)
                alert(`حدث خطأ: ${error.message}`)
            }
        }
    }

    return (
        <div className='max-w-2xl mx-auto'>
            {showMessage && (
                <div
                    className={`
                        bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded
                        transition-all duration-500 ease-in-out transform
                        ${
                            showMessage
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-full"
                        }
                    `}
                    role='alert'
                >
                    <p className='font-bold'>تم إنشاء المهمة بنجاح!</p>
                    <p>تم إرسال المهمة الجديدة وإضافتها إلى قائمة المهام.</p>
                </div>
            )}
            {!isSubmitted && (
                <form
                    onSubmit={handleSubmit}
                    className={`
                        p-6 bg-white rounded-lg shadow-md font-tajawal
                        transition-all duration-500 ease-in-out transform
                        ${
                            isSubmitted
                                ? "opacity-0 scale-95"
                                : "opacity-100 scale-100"
                        }
                    `}
                >
                    <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                        إنشاء مهمة جديدة
                    </h2>

                    <div className='mb-4'>
                        <label
                            htmlFor='title'
                            className='block mb-2 font-bold text-gray-700'
                        >
                            عنوان المهمة:
                        </label>
                        <input
                            type='text'
                            id='title'
                            name='title'
                            value={task.title}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.title
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.title && (
                            <p className='mt-1 text-red-500 text-sm'>
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className='mb-4'>
                        <label
                            htmlFor='description'
                            className='block mb-2 font-bold text-gray-700'
                        >
                            الوصف (اختياري):
                        </label>
                        <textarea
                            id='description'
                            name='description'
                            value={task.description}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.description
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            rows='4'
                        />
                        {errors.description && (
                            <p className='mt-1 text-red-500 text-sm'>
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className='mb-4'>
                        <label
                            htmlFor='priority'
                            className='block mb-2 font-bold text-gray-700'
                        >
                            الأولوية: <span className='text-red-500'>*</span>
                        </label>
                        <select
                            id='priority'
                            name='priority'
                            value={task.priority}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.priority
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        >
                            <option value=''>اختر الأولوية</option>
                            {priorityOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.priority && (
                            <p className='mt-1 text-red-500 text-sm'>
                                {errors.priority}
                            </p>
                        )}
                    </div>

                    <div className='mb-4'>
                        <label
                            htmlFor='assignedTo'
                            className='block mb-2 font-bold text-gray-700'
                        >
                            تم تعيينها إلى:
                        </label>
                        <select
                            id='assignedTo'
                            name='assignedTo'
                            value={task.assignedTo}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value=''>اختر موظفًا</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name} - {employee.role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label
                                htmlFor='startDate'
                                className='block mb-2 font-bold text-gray-700'
                            >
                                تاريخ البدء:{" "}
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='date'
                                id='startDate'
                                name='startDate'
                                value={task.startDate}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.startDate
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                            {errors.startDate && (
                                <p className='mt-1 text-red-500 text-sm'>
                                    {errors.startDate}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor='dueDate'
                                className='block mb-2 font-bold text-gray-700'
                            >
                                تاريخ الاستحقاق:{" "}
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='date'
                                id='dueDate'
                                name='dueDate'
                                value={task.dueDate}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.dueDate
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                            {errors.dueDate && (
                                <p className='mt-1 text-red-500 text-sm'>
                                    {errors.dueDate}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label
                                htmlFor='estimatedTime'
                                className='block mb-2 font-bold text-gray-700'
                            >
                                الوقت المقدر (بالساعات):{" "}
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='number'
                                id='estimatedTime'
                                name='estimatedTime'
                                value={task.estimatedTime}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.estimatedTime
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                min='1'
                                max='100'
                                step='1'
                                required
                            />
                            {errors.estimatedTime && (
                                <p className='mt-1 text-red-500 text-sm'>
                                    {errors.estimatedTime}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label
                            htmlFor='comments'
                            className='block mb-2 font-bold text-gray-700'
                        >
                            التعليقات/الملاحظات:
                        </label>
                        <textarea
                            id='comments'
                            name='comments'
                            value={task.comments}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            rows='4'
                        />
                        {errors.comments && (
                            <p className='mt-1 text-red-500 text-sm'>
                                {errors.comments}
                            </p>
                        )}
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                    >
                        إنشاء المهمة
                    </button>
                </form>
            )}
        </div>
    )
}

export default CreateTaskForm
