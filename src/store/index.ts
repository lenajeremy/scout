import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import {
    requestsReducer,
    requestTabsReducer,
    foldersReducer,
    collectionsReducer,
} from './slices'

const store = configureStore({
    reducer: {
        requests: requestsReducer,
        collections: collectionsReducer,
        folders: foldersReducer,
        tabs: requestTabsReducer,
    },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = () => useDispatch()