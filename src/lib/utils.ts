import { RequestHeadersType } from "@/types/form";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum ResponseTypesEnum {
  video = "VIDEO",
  image = "IMAGE",
  audio = "AUDIO",
  text = "TEXT",
  json = "JSON",
  html = "HTML"
}

export async function getResponseData<T>(res: Response): Promise<{ type: ResponseTypesEnum, data: T | undefined }> {
  const contentType = getHeadersFromReq(res)['content-type'] || '';

  let data: T | undefined;
  let type: ResponseTypesEnum = ResponseTypesEnum.json

  if (contentType.includes('json')) {
    data = await res.json() as T
    type = ResponseTypesEnum.json
  } else if (contentType.includes('text/plain')) {
    data = await res.text() as T
    type = ResponseTypesEnum.text
  } else if (contentType.includes('text/html')) {
    data = await res.text() as T
    type = ResponseTypesEnum.html
  } else if (
    contentType.includes('image') ||
    contentType.includes('video') ||
    contentType.includes('audio')
  ) {
    let blob = await res.blob()
    data = URL.createObjectURL(blob) as T
    type = contentType.includes('image') ? ResponseTypesEnum.image : contentType.includes('audio') ? ResponseTypesEnum.audio : ResponseTypesEnum.video
  } else {
    data = await res.text() as T;
    type = ResponseTypesEnum.text;
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
