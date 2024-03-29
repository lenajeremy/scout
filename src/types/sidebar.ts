import { Variable, Request } from "./collection"

export type SidebarFolder = {
    name: string,
    id: string,
    subFolders: SidebarFolder[],
    requests: Request[],
    parentFolderId: string,
    collectionId: string,
}

export type SidebarCollection = {
    name: string,
    id: string,
    folders: SidebarFolder[],
    requests: Request[],
    variables: Variable[]
}