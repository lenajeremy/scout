import { APIRequest, Collection, Folder, RequestMethod } from "@/types/collection";
import { RequestBodyEnum } from "@/types/form";

export const REQUEST_METHODS = [
    {
        value: RequestMethod.GET,
        label: "GET",
    },
    {
        value: RequestMethod.POST,
        label: "POST",
    },
    {
        value: RequestMethod.PUT,
        label: "PUT",
    },
    {
        value: RequestMethod.PATCH,
        label: "PATCH",
    },
    {
        value: RequestMethod.DELETE,
        label: "DELETE",
    },
    {
        value: RequestMethod.OPTIONS,
        label: "OPTIONS",
    },
    {
        value: RequestMethod.HEAD,
        label: "HEAD"
    }
] as const;


export const REQUEST_DEFAULT_VALUES: Omit<APIRequest, "id"> = {
    name: 'New Request',
    url: '',
    method: RequestMethod.GET,
    params: [{ key: '', value: '', description: '' }],
    formData: [{ key: '', value: '', description: '', type: 'text' }],
    bodyType: RequestBodyEnum.none,
    jsonBody: ``,
    headers: [{ key: 'Accept', value: '*/*' }],
    response: undefined,
}

export const DEFAULT_COLLECTION: Omit<Collection, 'id'> = {
    name: 'New Collection',
    variables: [],
    folderIds: [],
    requestIds: []
}

export const DEFAULT_FOLDER_WITHOUT_COLLECTION_ID: Omit<Folder, 'collectionId' | 'id'> = {
    name: "New Folder",
    requestIds: [],
    subFolderIds: [],
    parentFolderId: null
}