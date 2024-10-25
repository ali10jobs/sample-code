import "./globals.css"
import { Tajawal } from "next/font/google"

const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "700"] })

import { AuthProvider } from "./context/AuthContext"

export default function RootLayout({ children }) {
    return (
        <html lang='ar' dir='rtl'>
            <body className={tajawal.className}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
