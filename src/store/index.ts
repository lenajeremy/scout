import { configureStore, Middleware } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import {
    requestsReducer,
    requestTabsReducer,
    foldersReducer,
    collectionsReducer,
} from './slices'

import {
    collectionsMiddleware,
    folderMiddleware,
    requestMiddleware,
    requestTabMiddleware
} from './actions'


const middleware: Middleware[] = [
    requestMiddleware.middleware,
    folderMiddleware.middleware,
    requestTabMiddleware.middleware,
    collectionsMiddleware.middleware
]

const store = configureStore({
    reducer: {
        requests: requestsReducer,
        collections: collectionsReducer,
        folders: foldersReducer,
        tabs: requestTabsReducer,
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware().prepend(middleware)
    },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = () => useDispatch()