import { useAppSelector } from "@/store";

export const FIND_VARIABLE_REGEX = /{{(\w+)}}+/g

export function useReplaceVariableString({ originalString, collectionId} : { originalString: string, collectionId: string}) {
    const collection = useAppSelector(store => store.collections.collections.find(collection => collection.id === collectionId))
    const collectionVariables = Object.fromEntries(collection?.variables.map(v => ([v.key, v.value])) || [])

    if (!collection) return "INVALID COLLECTION ID"

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return originalString.replaceAll(FIND_VARIABLE_REGEX, (_, match) => collectionVariables[match])
}