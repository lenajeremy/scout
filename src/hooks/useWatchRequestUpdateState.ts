import { useAppSelector } from '@/store';
import { APIRequest, RequestWithSavedState } from '@/types/collection';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function useWatchRequestUpdateState(options?: { callbackIfMatches?: () => void, callbackIfNotMatches?: () => void }) {
    const formMethods = useFormContext<APIRequest>()
    const requestFormState = formMethods.watch()
    const activeTabId = useAppSelector(store => store.tabs.activeTabId)
    const lastSavedRequestState = useAppSelector(store => store.requests.find(r => r.id === activeTabId))!

    React.useEffect(() => {
        const lastSaveRequestToApiResquest = requestWithStateToFormRequest(lastSavedRequestState)
        const matches = JSON.stringify(lastSaveRequestToApiResquest) === JSON.stringify(requestFormState)

        if (options) {
            if (matches) {
                if (!lastSavedRequestState.isUpdated) {
                    options.callbackIfMatches && options.callbackIfMatches()
                }
            } else {
                if (lastSavedRequestState.isUpdated) {
                    options.callbackIfNotMatches && options.callbackIfNotMatches()
                }
            }
        }

    }, [requestFormState])
}

function requestWithStateToFormRequest(r: RequestWithSavedState): Omit<APIRequest, 'id'> {
    // note the arrangement of these values must match the definition of DEFAULT_API_REQUEST
    // so I can use JSON.stringify to compare the values between the api request and the 
    // request in the redux store
    return {
        name: r.name,
        url: r.url,
        method: r.method,
        params: r.params,
        formData: r.formData,
        bodyType: r.bodyType,
        jsonBody: r.jsonBody,
        headers: r.headers,
        response: r.response
    }
}