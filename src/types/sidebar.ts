import { Variable, RequestWithSavedState } from "./collection"

export type SidebarFolder = {
    name: string,
    id: string,
    subFolders: SidebarFolder[],
    requests: RequestWithSavedState[],
    parentFolderId: string,
    collectionId: string,
}

export type SidebarCollection = {
    name: string,
    id: string,
    folders: SidebarFolder[],
    requests: RequestWithSavedState[],
    variables: Variable[]
}