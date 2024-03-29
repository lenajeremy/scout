import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Request } from "@/types/collection";

const initialState: Array<Request> = []

const requestsSlice = createSlice({
    name: 'requestsSlice',
    initialState,
    reducers: {
        bulkAddRequests: (state, action: PayloadAction<Array<Request>>) => {
            return [...state, ...action.payload]
        },
        addRequest: (state, action: PayloadAction<Request>) => {
            return [...state, action.payload]
        },
        deleteRequest: (state, action: PayloadAction<string>) => {
            return state.filter(r => r.id !== action.payload)
        },
        editRequest: (state, action: PayloadAction<Request>) => {
            const requestToEditIndex = state.findIndex(r => r.id === action.payload.id)
            if (requestToEditIndex !== -1) {
                state[requestToEditIndex] = action.payload;
            }
            return state;
        }
    }
})

export default requestsSlice.reducer
export const { 
    addRequest, 
    deleteRequest,
    editRequest,
    bulkAddRequests
} = requestsSlice.actions