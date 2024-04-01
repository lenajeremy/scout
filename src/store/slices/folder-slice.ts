import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Folder } from "@/types/collection";


const initialState: {
    folders: Array<Folder>,
    activeFolderId: string
} = {
    folders: [],
    activeFolderId: ''
}

const foldersSlice = createSlice({
    name: 'foldersSlice',
    initialState,
    reducers: {
        bulkAddFolders: (state, action: PayloadAction<Array<Folder>>) => {
            state.folders = [...state.folders, ...action.payload]
            state.activeFolderId = action.payload.length === 0 ? "" : action.payload.at(action.payload.length - 1)?.id || ""

            return state
        },
        createFolder: (state, action: PayloadAction<Folder>) => {
            state.folders.push(action.payload)
            state.activeFolderId = action.payload.id

            if (action.payload.parentFolderId) {
                state.folders.find(f => f.id == action.payload.parentFolderId)?.subFolderIds.push(action.payload.id)
            }
            return state
        },
        deleteFolder: (state, action: PayloadAction<string>) => {
            const filteredFolders = state.folders.filter(f => f.id !== action.payload)
            state.folders = filteredFolders

            if (action.payload === state.activeFolderId) {
                state.activeFolderId = filteredFolders.at(filteredFolders.length - 1)?.id || ''
            }

            return state
        },
        deleteFoldersInCollection: (state, action: PayloadAction<string>) => {
            const filteredFolders = state.folders.filter(f => f.collectionId !== action.payload)
            state.folders = filteredFolders

            state.activeFolderId = filteredFolders.at(filteredFolders.length - 1)?.id || ""
            
            return state;
        },
        editFolder: (state, action: PayloadAction<Folder>) => {
            const folderIndex = state.folders.findIndex(c => c.id === action.payload.id)
            if (folderIndex !== -1) {
                state.folders[folderIndex] = action.payload
            }
            return state
        },
        addRequestToFolder: (state, action: PayloadAction<{ folderId: string, requestId: string }>) => {
            const folderToAddIndex = state.folders.findIndex(f => f.id === action.payload.folderId)
            if (folderToAddIndex !== -1) {
                state.folders[folderToAddIndex].requestIds.push(action.payload.requestId)
            }
            return state
        },
        setActiveFolder: (state, action: PayloadAction<string>) => {
            state.activeFolderId = action.payload
            return state
        }
    }
})

export default foldersSlice.reducer
export const {
    bulkAddFolders,
    createFolder,
    deleteFolder,
    editFolder,
    addRequestToFolder,
    deleteFoldersInCollection,
    setActiveFolder: setActiveFolderAction
} = foldersSlice.actions