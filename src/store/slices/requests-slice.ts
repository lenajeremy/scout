import { createSlice, PayloadAction, createListenerMiddleware, ListenerEffectAPI } from "@reduxjs/toolkit";
import { RequestWithSavedState } from "@/types/collection";
import { AppDispatch, RootState } from "..";

const initialState: RequestWithSavedState[] = []

const requestsSlice = createSlice({
    name: 'requestsSlice',
    initialState,
    reducers: {
        bulkAddRequests: (state, action: PayloadAction<RequestWithSavedState[]>) => {
            return [...state, ...action.payload]
        },
        addRequest: (state, action: PayloadAction<RequestWithSavedState>) => {
            return [...state, action.payload]
        },
        deleteRequest: (state, action: PayloadAction<string>) => {
            return state.filter(r => r.id !== action.payload)
        },
        deleteRequestsInCollection: (state, action: PayloadAction<string>) => {
            return state.filter(r => r.collectionId !== action.payload)
        },
        deleteRequestsInFolder: (state, action: PayloadAction<string>) => {
            return state.filter(r => r.folderId !== action.payload)
        },
        editRequest: (state, action: PayloadAction<RequestWithSavedState>) => {
            const requestToEditIndex = state.findIndex(r => r.id === action.payload.id)
            if (requestToEditIndex !== -1) {
                state[requestToEditIndex] = action.payload;
            }
            return state;
        }
    }
})

export const requestMiddleware = createListenerMiddleware<RootState, AppDispatch>()

function updateLocalStorage(listenerApi: ListenerEffectAPI<RootState, AppDispatch>) {
    const requests = listenerApi.getState().requests;
    localStorage.setItem("REQUESTS", JSON.stringify(requests))
}

Object.values(requestsSlice.actions).forEach(action => requestMiddleware.startListening({
    actionCreator: action,
    effect: async (_, listenerApi) => updateLocalStorage(listenerApi)
}))


export const {
    addRequest,
    deleteRequest,
    editRequest,
    bulkAddRequests,
    deleteRequestsInCollection,
    deleteRequestsInFolder
} = requestsSlice.actions

export default requestsSlice.reducer