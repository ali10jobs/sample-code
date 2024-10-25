import { useState } from "react"

export const useValidate = () => {
    const [errors, setErrors] = useState({})

    const validateTitle = (title) => {
        const trimmedTitle = title.trim()
        if (!trimmedTitle) {
            return "عنوان المهمة مطلوب"
        }
        if (trimmedTitle.length < 2) {
            return "يجب أن يحتوي العنوان على حرفين على الأقل"
        }
        if (trimmedTitle.length > 100) {
            return "يجب ألا يتجاوز العنوان 100 حرف"
        }
        if (!/^[\u0600-\u06FFa-zA-Z0-9\s.,!?()-]+$/.test(trimmedTitle)) {
            return "يجب أن يحتوي العنوان على أحرف وأرقام وعلامات ترقيم أساسية فقط"
        }
        return ""
    }

    const validateDescription = (description) => {
        const trimmedDescription = description.trim()
        if (trimmedDescription.length > 1000) {
            return "يجب ألا يتجاوز الوصف 1000 حرف"
        }
        return ""
    }

    const validatePriority = (priority) => {
        if (!priority) {
            return "الأولوية مطلوبة"
        }
        const priorityOptions = ["منخفضة", "متوسطة", "عالية"]
        if (!priorityOptions.includes(priority)) {
            return "الرجاء اختيار أولوية صالحة"
        }
        return ""
    }

    const validateStartDate = (startDate, dueDate) => {
        if (!startDate) {
            return "تاريخ البدء مطلوب"
        }

        const startDateObj = new Date(startDate)
        const dueDateObj = dueDate ? new Date(dueDate) : null
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (isNaN(startDateObj.getTime())) {
            return "صيغة التاريخ غير صالحة"
        }

        if (startDateObj < today) {
            return "يجب أن يكون تاريخ البدء اليوم أو في المستقبل"
        }

        if (dueDateObj && startDateObj > dueDateObj) {
            return "يجب أن يكون تاريخ البدء قبل أو يساوي تاريخ الإستحقاق"
        }

        return ""
    }

    const validateDueDate = (dueDate, startDate) => {
        if (!dueDate) {
            return "تاريخ الاستحقاق مطلوب"
        }

        const dueDateObj = new Date(dueDate)
        const startDateObj = startDate ? new Date(startDate) : null
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (isNaN(dueDateObj.getTime())) {
            return "صيغة التاريخ غير صالحة"
        }

        if (dueDateObj < today) {
            return "يجب أن يكون تاريخ الاستحقاق في المستقبل"
        }

        if (startDateObj && dueDateObj < startDateObj) {
            return "يجب أن يكون تاريخ الاستحقاق بعد أو يساوي تاريخ البدء"
        }

        return ""
    }

    const validateEstimatedTime = (estimatedTime) => {
        if (!estimatedTime) {
            return "الوقت المقدر مطلوب"
        }

        const numericValue = parseInt(estimatedTime, 10)

        if (isNaN(numericValue)) {
            return "يجب أن يكون الوقت المقدر رقمًا صحيحًا"
        }

        if (numericValue <= 0) {
            return "يجب أن يكون الوقت المقدر أكبر من صفر"
        }

        if (numericValue > 100) {
            return "يجب أن يكون الوقت المقدر 100 ساعة أو أقل"
        }

        if (numericValue !== parseFloat(estimatedTime)) {
            return "يجب أن يكون الوقت المقدر ساعة واحدة على اﻷقل"
        }

        return ""
    }

    const validateComments = (comments) => {
        if (comments.trim().length > 500) {
            return "يجب ألا يتجاوز طول التعليقات 500 حرف"
        }
        return ""
    }

    const validateField = (name, value, task) => {
        let error = ""
        switch (name) {
            case "title":
                error = validateTitle(value)
                break
            case "description":
                error = validateDescription(value)
                break
            case "priority":
                error = validatePriority(value)
                break
            case "startDate":
                error = validateStartDate(value, task.dueDate)
                break
            case "dueDate":
                error = validateDueDate(value, task.startDate)
                break
            case "estimatedTime":
                error = validateEstimatedTime(value)
                break
            case "comments":
                error = validateComments(value)
                break
            default:
                break
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))
        return error
    }

    const validateAllFields = (task) => {
        const newErrors = {
            title: validateTitle(task.title),
            description: validateDescription(task.description),
            priority: validatePriority(task.priority),
            startDate: validateStartDate(task.startDate, task.dueDate),
            dueDate: validateDueDate(task.dueDate, task.startDate),
            estimatedTime: validateEstimatedTime(task.estimatedTime),
            comments: validateComments(task.comments),
        }
        setErrors(newErrors)
        return Object.values(newErrors).every((error) => error === "")
    }

    return { errors, validateField, validateAllFields }
}

export default useValidate
