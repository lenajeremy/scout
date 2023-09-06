'use client'
import * as React from 'react'
import { RequestsManager } from './contexts/requestsmanager'
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <RequestsManager>
                {children}
            </RequestsManager>
        </ThemeProvider>
    )
}
