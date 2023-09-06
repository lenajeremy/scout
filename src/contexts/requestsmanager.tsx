import { RequestBodyEnum, RequestFormType } from '@/types/form'
import * as React from 'react'


type RequestsManagerContextType = {
    requests: RequestFormType[],
    addRequest: (request: RequestFormType) => void,
    removeRequest: (index: number) => void,
    activeRequest: RequestFormType | null,
    updateActiveRequest: (request: RequestFormType) => void,
}
export const RequestsManagerContext = React.createContext<RequestsManagerContextType>({
    requests: [],
    addRequest: (request) => { alert('dumb request'); console.log(request) },
    removeRequest: () => { },
    activeRequest: null,
    updateActiveRequest: () => { },
})

export const REQUEST_DEFAULT_VALUES: RequestFormType = {
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

    const addRequest = (request: RequestFormType) => {
        setRequests([...requests, request])
    }

    const removeRequest = (index: number) => {
        setRequests(requests.filter((_, i) => i !== index))
    }

    return (
        <RequestsManagerContext.Provider value={{
            requests, addRequest,
            removeRequest, activeRequest,
            updateActiveRequest: setActiveRequest
        }}>
            {children}
        </RequestsManagerContext.Provider>
    )
}