import { Collection, Variable } from "@/types/collection";
import { createListenerMiddleware, createSlice, ListenerEffectAPI, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";

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
        bulkAddCollections: (state, action: PayloadAction<Collection[]>) => {
            state.collections = action.payload || []
            state.activeCollectionId = state.collections.length === 0 ? "" : state.collections.at(state.collections.length - 1)?.id || ""

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
        },
        addVariablesToCollection: (state, action: PayloadAction<{ collectionId: string, variables: Variable[] }>) => {
            const colIdx = state.collections.findIndex(c => c.id === action.payload.collectionId)
            if (colIdx != -1) {
                const col = state.collections[colIdx]
                for (let v of action.payload.variables) {
                    let colVar = col.variables.find(cv => cv.key === v.key)
                    if (colVar) {
                        colVar.value = v.value
                    } else {
                        col.variables.push(v)
                    }
                }
            }
            return state
        },
        removeVariableFromCollection: (state, action: PayloadAction<{ collectionId: string, variableKeys: string[] }>) => {
            const colIdx = state.collections.findIndex(c => c.id === action.payload.collectionId)
            if (colIdx != -1) {
                const col = state.collections[colIdx]
                for (let key of action.payload.variableKeys) {
                    col.variables = col.variables.filter(v => v.key !== key)
                }
            }
            return state
        }
    }
})

export const collectionsMiddleware = createListenerMiddleware<RootState, AppDispatch>()

function updateLocalStorage(listenerApi: ListenerEffectAPI<RootState, AppDispatch>) {
    const collections = listenerApi.getState().collections.collections;
    localStorage.setItem("COLLECTIONS", JSON.stringify(collections))
}

Object.values(collectionsSlice.actions).forEach(action => collectionsMiddleware.startListening({
    actionCreator: action,
    effect: async (_, listenerApi) => updateLocalStorage(listenerApi)
}))


export default collectionsSlice.reducer
export const {
    bulkAddCollections,
    createCollection,
    deleteCollection,
    editCollection,
    addFolderToCollection,
    addRequestToCollection,
    addVariablesToCollection,
    removeVariableFromCollection,
    setActiveCollection: setActiveCollectionAction,
} = collectionsSlice.actions