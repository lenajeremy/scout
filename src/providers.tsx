'use client'
import * as React from 'react'
import { RequestsManager } from './contexts/requestsmanager'

export default function Providers({ children } : { children: React.ReactNode }) {
    return (
        <RequestsManager>
            { children }
        </RequestsManager>
    )
}
