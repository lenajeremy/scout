export const REQUEST_METHODS = [
    {
        value: "get",
        label: "GET",
    },
    {
        value: "post",
        label: "POST",
    },
    {
        value: "put",
        label: "PUT",
    },
    {
        value: "patch",
        label: "PATCH",
    },
    {
        value: "delete",
        label: "DELETE",
    },
    {
        value: "options",
        label: "OPTIONS",
    },
    {
        value: "head",
        label: "HEAD"
    }
] as const;


export type RequestMethod = typeof REQUEST_METHODS[number]['value']


