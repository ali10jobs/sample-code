"use client"

import React, { createContext, useReducer, useContext, useEffect } from "react"

const AuthContext = createContext()

const initialState = {
    isAuthenticated: false,
    user: null,
}

function authReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                isAuthenticated: true,
                user: action.payload,
            }
        case "LOGOUT":
            return {
                isAuthenticated: false,
                user: null,
            }
        default:
            return state
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect(() => {
        // Retrieve authentication state from local storage when the app loads
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) })
        }
    }, [])

    useEffect(() => {
        // Update local storage when authentication state changes
        if (state.isAuthenticated) {
            localStorage.setItem("user", JSON.stringify(state.user))
        } else {
            localStorage.removeItem("user")
        }
    }, [state.isAuthenticated, state.user])

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
