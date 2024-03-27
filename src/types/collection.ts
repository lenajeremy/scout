import {
    BodyFormData,
    ParamsFormValues,
    RequestBodyEnum,
    RequestHeadersType
} from "./form"


/**
 * 
 */
export enum ResponseTypeEnum {
    video = "VIDEO",
    image = "IMAGE",
    audio = "AUDIO",
    text = "TEXT",
    json = "JSON",
    html = "HTML"
}


/**
 * 
 */
export enum RequestMethod {
    GET = "get",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    DELETE = "delete",
    OPTIONS = "options",
    HEAD = "head"
}


/**
 * A instance of a request which contains the request information
 * required to create an HTTPRequest. 
 */
export type APIRequest = {
    id: string,
    name: string,
    url: string,
    method: RequestMethod,
    params?: ParamsFormValues,
    formData?: BodyFormData,
    bodyType: RequestBodyEnum,
    jsonBody: string,
    headers: RequestHeadersType,
    response?: {
        data: any,
        type: ResponseTypeEnum,
        status: number
    }
}


/**
 * Extends the base APIRequest but contains data like 
 * `collectionId` and `folderId` which is used to render the request 
 * in the correct folder.
 */
export type Request = APIRequest & {
    collectionId: string,
    folderId: string,
}


/**
 * Groups of requests and folders. Contains variables and 
 * authentication applied on collection is applied to all 
 * requests in the collection
 */
export type Collection = {
    name: string,
    id: string,
    variables: Variable[],
    folderIds: string[],
    requestIds: string[]
}


/**
 * A key-value pair to store global/collection-level information
 * that can be accessed by requests in the collection
 */
export type Variable = {
    key: string,
    value: string,
}


/**
 * Simply a group of requests.
 */
export type Folder = {
    id: string
    name: string,
    requestIds: string[],
    collectionId: string,
    subFolderIds: string[],
    parentFolderId: string | null
}