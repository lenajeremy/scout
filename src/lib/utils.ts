import { Collection, Folder, ResponseTypeEnum, Request, RequestMethod } from "@/types/collection";
import { SidebarCollection, SidebarFolder } from '@/types/sidebar'
import { RequestBodyEnum, RequestHeadersType } from "@/types/form";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AppDispatch } from "@/store";
import {
  addFolderToCollection, addRequest,
  addRequestToCollection, addRequestToFolder,
  bulkAddFolders,
  bulkAddRequests,
  createCollection, createFolder,
  deleteFoldersInCollection,
  deleteRequestsInCollection,
  deleteCollection as deleteCollectionAction,
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
    const blob = await res.blob()
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
  //@ts-ignore
  Array.from(obj.headers.entries()).map(([key, value]) => {
    // @ts-ignore
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

function buildFolder(folderId: string, f: Folder[], r: Request[], collectionId = ''): SidebarFolder {
  const folder = f.find(f => f.id == folderId)!

  const folderToReturn: SidebarFolder = {
    collectionId,
    id: folder.id,
    name: folder.name,
    subFolders: folder.subFolderIds.map(fId => buildFolder(fId, f, r, collectionId)),
    requests: folder.requestIds.map(rId => r.find(r => r.id === rId)!),
    parentFolderId: String(folder.parentFolderId),
  }

  return folderToReturn
}

export function buildSidebarStructure(c: Collection[], f: Folder[], r: Request[]): SidebarCollection[] {
  let _collections: SidebarCollection[] = c.map(c => ({
    id: c.id,
    name: c.name,
    variables: c.variables,
    folders: [],
    requests: []
  }))

  for (let folder of f) {
    if (!folder.parentFolderId) {
      let folderCollection = _collections.find(c => c.id === folder.collectionId)
      folderCollection?.folders.push(buildFolder(folder.id, f, r, folderCollection.id))
    }
  }

  for (let request of r) {
    if (!request.folderId) {
      _collections.find(c => c.id == request.collectionId)?.requests.push(request)
    }
  }

  return _collections
}

export function updateStoreFromCollection(postmanJSON: any, dispatch: AppDispatch) {
  const collection: Collection = {
    name: postmanJSON.collection.info.name,
    id: postmanJSON.collection.info._postman_id,
    variables: postmanJSON.collection.variable || [],
    folderIds: [],
    requestIds: []
  }

  const folders: Folder[] = []
  const requests: Request[] = []

  postmanJSON.collection.item.forEach((item: any) => {
    buildItem(item)
  })

  function buildItem(item: any, folderId = "") {
    if (item.request && item.response) {
      const request: Request = {
        id: item.id,
        name: item.name,
        url: item.request.url?.raw || '',
        method: item.request.method?.toLowerCase() as RequestMethod || RequestMethod.GET,
        params: item.request.url?.query || [],
        formData: item.request.body?.formdata?.map((f: any) => ({ key: f.key, type: f.type, value: f.type === 'file' ? f.src : f.value })),
        bodyType: item.request.body?.mode === 'raw' ? RequestBodyEnum.binary : item.request.body?.mode as RequestBodyEnum || RequestBodyEnum.none,
        jsonBody: item.request.body?.raw || "",
        headers: item.request.header.map((h: any) => ({ key: h.key, value: h.value })),
        collectionId: collection.id,
        folderId: folderId
      }

      if (!folderId) {
        collection.requestIds.push(request.id);
      } else {
        folders.find(folder => folder.id === folderId)?.requestIds.push(request.id)
      }

      requests.push(request)
    } else {
      const folder: Folder = {
        id: item.id,
        name: item.name,
        requestIds: [],
        collectionId: collection.id,
        subFolderIds: [],
        parentFolderId: folderId
      }

      if (!folderId) {
        collection.folderIds.push(folder.id)
        console.log(item.name)
      } else {
        folders.find(folder => folder.id === folderId)?.subFolderIds.push(folder.id)
      }

      folders.push(folder)

      item.item.forEach((item: any) => buildItem(item, folder.id))
    }
  }

  dispatch(createCollection(collection))
  dispatch(bulkAddFolders(folders))
  dispatch(bulkAddRequests(requests))
}

export function createNewCollection(actor: AppDispatch) {
  const newCollection = { ...DEFAULT_COLLECTION, id: uuid() }
  actor(createCollection(newCollection))
}

export function deleteCollection(actor: AppDispatch, collectionId: string) {
  actor(deleteRequestsInCollection(collectionId))
  actor(deleteFoldersInCollection(collectionId))
  actor(deleteCollectionAction(collectionId))
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