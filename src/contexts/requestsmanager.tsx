import * as React from 'react'
import { RequestBodyEnum, RequestFormType } from '@/types/form'
import { v4 as uuid } from 'uuid'


type RequestsManagerContextType = {
    requests: RequestFormType[],
    initRequests: (requests: RequestFormType[]) => void,
    saveRequest: (request: RequestFormType) => void,
    removeRequest: (index: number) => void,
    activeRequest: RequestFormType | null,
    updateActiveRequest: (request: RequestFormType) => void,
}
export const RequestsManagerContext = React.createContext<RequestsManagerContextType>({
    requests: [],
    initRequests: () => { },
    saveRequest: () => { },
    removeRequest: () => { },
    activeRequest: null,
    updateActiveRequest: () => { },
})

export const REQUEST_DEFAULT_VALUES: RequestFormType = {
    id: uuid(),
    name: 'New Request',
    url: '',
    method: 'get',
    params: [{ key: '', value: '', description: '' }],
    formData: [{ key: '', value: '', description: '', type: 'text' }],
    bodyType: RequestBodyEnum.none,
    jsonBody:
        `{

}`,
    headers: [{ key: 'Accept', value: '*/*' }]
}


export const RequestsManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [requests, setRequests] = React.useState<RequestFormType[]>([])
    const [activeRequest, setActiveRequest] = React.useState<RequestFormType>(REQUEST_DEFAULT_VALUES)

    const saveRequest = (request: RequestFormType) => {
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

    const initRequests = (requests: RequestFormType[]) => {
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