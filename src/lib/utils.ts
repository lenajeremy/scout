import { Collection, Folder, ResponseTypeEnum, Request } from "@/types/collection";
import { SidebarCollection, SidebarFolder } from '@/types/sidebar'
import { RequestHeadersType } from "@/types/form";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AppDispatch } from "@/store";
import {
  addFolderToCollection, addRequest,
  addRequestToCollection, addRequestToFolder,
  createCollection, createFolder,
  setActiveCollectionAction, setActiveFolderAction
} from "@/store/actions";
import { DEFAULT_COLLECTION, DEFAULT_FOLDER_WITHOUT_COLLECTION_ID, REQUEST_DEFAULT_VALUES } from "@/constants";
import { v4 as uuid } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getResponseData<T>(res: Response): Promise<{ type: ResponseTypeEnum, data: T | undefined }> {
  const contentType = getHeadersFromReq(res)['content-type'] || '';

  let data: T | undefined;
  let type: ResponseTypeEnum = ResponseTypeEnum.json

  if (contentType.includes('json')) {
    data = await res.json() as T
    type = ResponseTypeEnum.json
  } else if (contentType.includes('text/plain')) {
    data = await res.text() as T
    type = ResponseTypeEnum.text
  } else if (contentType.includes('text/html')) {
    data = await res.text() as T
    type = ResponseTypeEnum.html
  } else if (
    contentType.includes('image') ||
    contentType.includes('video') ||
    contentType.includes('audio')
  ) {
    let blob = await res.blob()
    data = URL.createObjectURL(blob) as T
    type = contentType.includes('image') ? ResponseTypeEnum.image : contentType.includes('audio') ? ResponseTypeEnum.audio : ResponseTypeEnum.video
  } else {
    data = await res.text() as T;
    type = ResponseTypeEnum.text;
  }

  return { data, type };

}

export function getHeadersFromReq(obj: Response | Request): Record<string, string> {
  const headers: Record<string, string> = {}
  Array.from(obj.headers.entries()).map(([key, value]) => {
    headers[key] = value;
  })

  return headers;
}

export function prepareHeaders(headers: RequestHeadersType): Record<string, string> {
  const map: Record<string, string> = {}

  headers.forEach(header => {
    if (header.key) {
      map[header.key] = header.value;
    }
  })

  return map;
}

function buildFolder(folderId: string, f: Folder[], r: Request[]): SidebarFolder {
  const folder = f.find(f => f.id == folderId)
  if (folder) {
    const folderToReturn: SidebarFolder = {
      id: folder.id,
      name: folder.name,
      subFolders: folder.subFolderIds.map(fId => buildFolder(fId, f, r)),
      requests: folder.requestIds.map(rId => r.find(r => r.id === rId)!),
      parentFolderId: String(folder.parentFolderId),
    }
    return folderToReturn
  } else {
    alert(`folder with id ${folderId} not found in list of folders ${JSON.stringify(f)}`)
  }
}

export function buildSidebarStructure(c: Collection[], f: Folder[], r: Request[]) {
  let _collections: SidebarCollection[] = c.map(c => ({
    id: c.id,
    name: c.name,
    variables: c.variables,
    folders: [],
    requests: []
  }))

  for (let folder of f) {
    if (!folder.parentFolderId) {
      _collections.find(c => c.id == folder.collectionId)?.folders.push(buildFolder(folder.id, f, r))
    }
  }

  for (let request of r) {
    if (!request.folderId) {
      _collections.find(c => c.id == request.collectionId)?.requests.push(request)
    }
  }

  return _collections
}

export function createNewCollection(actor: AppDispatch) {
  const newCollection = { ...DEFAULT_COLLECTION, id: uuid() }
  actor(createCollection(newCollection))
}

export function createNewFolder(actor: AppDispatch, collectionId: string, parentFolderId: string) {
  const newFolder: Folder = {
    ...DEFAULT_FOLDER_WITHOUT_COLLECTION_ID,
    id: uuid(),
    parentFolderId,
    collectionId
  }
  actor(createFolder(newFolder))
  actor(addFolderToCollection({ collectionId, folderId: newFolder.id, }))
}

export function createNewRequest(actor: AppDispatch, collectionId: string, folderId: string) {
  const newRequest: Request = {
    ...REQUEST_DEFAULT_VALUES,
    id: uuid(),
    folderId,
    collectionId
  }

  actor(addRequest(newRequest))
  actor(addRequestToFolder({
    folderId,
    requestId: newRequest.id
  }))

  actor(addRequestToCollection({
    collectionId,
    requestId: newRequest.id
  }))
}

export function setActiveCollection(actor: AppDispatch, collectionId: string) {
  actor(setActiveCollectionAction(collectionId))
  actor(setActiveFolderAction(''))
}

export function setActiveFolder(actor: AppDispatch, folderId: string, collectionId: string) {
  actor(setActiveFolderAction(folderId))
  actor(setActiveCollectionAction(collectionId))
}