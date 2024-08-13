import { Collection } from "@/types/collection";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    collections: Array<Collection>,
    activeCollectionId: string
} = {
    collections: [],
    activeCollectionId: ''
}

const collectionsSlice = createSlice({
    name: "collectionsSlice",
    initialState,
    reducers: {
        initCollections: (state, action: PayloadAction<typeof initialState>) => {
            state.collections = action.payload.collections || []
            localStorage.setItem('collections', state.collections)

            if (!action.payload.activeCollectionId) {
                state.activeCollectionId = state.collections.length === 0 ? "" : state.collections.at(state.collections.length - 1)?.id || ""
            }

            return state
        },
        createCollection: (state, action: PayloadAction<Collection>) => {
            state.collections.push(action.payload)
            state.activeCollectionId = action.payload.id
            return state
        },
        deleteCollection: (state, action: PayloadAction<string>) => {
            const filteredCollections = state.collections.filter(c => c.id !== action.payload)
            state.collections = filteredCollections

            if (state.activeCollectionId === action.payload) {
                state.activeCollectionId = filteredCollections.at(filteredCollections.length - 1)?.id || ''
            }

            return state
        },
        editCollection: (state, action: PayloadAction<Collection>) => {
            const collectionIndex = state.collections.findIndex(c => c.id === action.payload.id)
            if (collectionIndex !== -1) {
                state.collections[collectionIndex] = action.payload
            }
            return state
        },
        addRequestToCollection: (state, action: PayloadAction<{ collectionId: string, requestId: string }>) => {
            const collectionToAddIndex = state.collections.findIndex(c => c.id === action.payload.collectionId)
            if (collectionToAddIndex !== -1) {
                state.collections[collectionToAddIndex].requestIds.push(action.payload.requestId)
            }
            return state
        },
        addFolderToCollection: (state, action: PayloadAction<{ collectionId: string, folderId: string }>) => {
            const collectionToAddIndex = state.collections.findIndex(c => c.id === action.payload.collectionId)
            if (collectionToAddIndex !== -1) {
                state.collections[collectionToAddIndex].folderIds.push(action.payload.folderId)
            }
            return state
        },
        setActiveCollection: (state, action: PayloadAction<string>) => {
            state.activeCollectionId = action.payload
            return state;
        }
    }
})

export default collectionsSlice.reducer
export const {
    initCollections,
    createCollection,
    deleteCollection,
    editCollection,
    addFolderToCollection,
    addRequestToCollection,
    setActiveCollection: setActiveCollectionAction,
} = collectionsSlice.actions