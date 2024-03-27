import * as React from 'react'
import { RequestBodyEnum } from '@/types/form'
import { APIRequest, RequestMethod } from '@/types/collection'



type RequestsManagerContextType = {
    requests: APIRequest[],
    initRequests: (requests: APIRequest[]) => void,
    saveRequest: (request: APIRequest) => void,
    removeRequest: (index: number) => void,
    activeRequest: APIRequest | null,
    updateActiveRequest: (request: APIRequest) => void,
}
export const RequestsManagerContext = React.createContext<RequestsManagerContextType>({
    requests: [],
    initRequests: () => { },
    saveRequest: () => { },
    removeRequest: () => { },
    activeRequest: null,
    updateActiveRequest: () => { },
})


export const RequestsManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [requests, setRequests] = React.useState<APIRequest[]>([])
    const [activeRequest, setActiveRequest] = React.useState<APIRequest>(REQUEST_DEFAULT_VALUES)

    const saveRequest = (request: APIRequest) => {
        const index = requests.findIndex(r => r.id === request.id)
        if (index === -1) {
            setRequests([...requests, request])
            localStorage.setItem('requests', JSON.stringify([...requests, request]))
        } else {
            const newRequests = [...requests]
            newRequests[index] = request
            localStorage.setItem('requests', JSON.stringify(newRequests))
            setRequests(newRequests)
        }
    }

    const initRequests = (requests: APIRequest[]) => {
        setRequests(requests)
    }

    const removeRequest = (index: number) => {
        setRequests(requests.filter((_, i) => i !== index))
    }

    return (
        <RequestsManagerContext.Provider value={{
            requests, saveRequest, initRequests,
            removeRequest, activeRequest,
            updateActiveRequest: setActiveRequest
        }}>
            {children}
        </RequestsManagerContext.Provider>
    )
}