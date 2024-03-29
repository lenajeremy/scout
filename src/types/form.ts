
export type ParamsFormValues = Array<{
    key: string,
    value: string,
    description?: string,
}>

export enum RequestBodyEnum {
    none = 'none',
    formData = 'formdata',
    json = "json",
    binary = "binary",
}

export type BodyFormData = Array<{
    key: string,
    value: string | FileList,
    type: 'file' | 'text'
    description?: string,
}>

export type RequestHeadersType = Array<{
    key: string,
    value: string,
}>

