'use client'

import * as React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RequestParametersForm } from '@/components/requestparametersform'
import { RequestBodyForm } from '@/components/requestbodyform'
import { REQUEST_METHODS, RequestMethod } from '@/constants'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { BodyFormData, RequestBodyEnum, RequestFormType } from '@/types/form'
import { ResponseTypesEnum, getResponseData, prepareHeaders } from '@/lib/utils'
import { RequestHeadersForm } from '@/components/requestheadersform'


const TABS_CLASSNAME = 'w-full overflow-hidden relative data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0'
const isFile = (d: BodyFormData[number]): d is { key: string, value: FileList, type: 'file' } => {
  return d.type === 'file'
}


type WithoutPromise<T> = T extends Promise<infer T> ? T : never


export default function Home() {

  const [responseData, setResponseData] = React.useState<WithoutPromise<ReturnType<typeof getResponseData>>>({ data: '', type: ResponseTypesEnum.json });
  const [status, setStatus] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false);
  const formMethods = useForm<RequestFormType>({
    defaultValues: {
      url: '',
      method: 'get',
      params: [{ key: '', value: '', description: '' }],
      formData: [{ key: '', value: '', description: '', type: 'text' }],
      bodyType: RequestBodyEnum.none,
      jsonBody: '{}',
      headers: [{ key: 'Accept', value: '*/*' }]
    }
  })

  const makeRequest: SubmitHandler<RequestFormType> = async (data) => {
    setLoading(true)

    const headers = prepareHeaders(data.headers)
    let res: Response | undefined = undefined;

    try {
      if (data.method === 'get' || data.method === 'head') {
        res = await fetch(data.url, { method: 'GET', headers })
      } else {
        switch (data.bodyType) {
          case RequestBodyEnum.json:
            res = await fetch(data.url, { method: data.method, body: data.jsonBody, headers });
            break;

          case RequestBodyEnum.formData:
            const formData = new FormData()
            data.formData?.map(d => {
              if (isFile(d)) {
                Array.from(d.value).forEach(file => formData.append(d.key, file, file.name))
              } else {
                formData.append(d.key, d.value as string)
              }
            })

            res = await fetch(data.url, { method: data.method, body: formData, headers })
            break;

          case RequestBodyEnum.none:
            res = await fetch(data.url, { method: data.method, headers })
            break;
        }
      }

      if (res) {
        const requestData = await getResponseData<any>(res);
        setResponseData(requestData)
        setStatus(`${res.status}: ${res.statusText}`)
        console.log(requestData)
      }
    } catch (error) {
      alert(error)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }




  return (
    <main className='px-8 py-16 w-1/2 mx-auto'>
      <FormProvider {...formMethods} >
        <form onSubmit={formMethods.handleSubmit(makeRequest)} autoComplete='off'>
          <div className='flex items-center gap-2 mb-4'>
            <Select
              // @ts-ignore
              options={REQUEST_METHODS}
              onChange={option => formMethods.setValue('method', option as RequestMethod)}
              placeholder='Request Method'
              searchPlaceholder='Search request method'
              defaultValue='get'
            />
            <Input
              type='url'
              placeholder='Enter request url'
              className='outline-none w-[480px]'
              autoFocus
              {...formMethods.register('url', { required: true })}
            />
            <Button loading={loading} className='flex-1' type='submit'>Send</Button>
          </div>

          <div>
            <Tabs defaultValue="params">

              <TabsList className='w-full'>
                <TabsTrigger className={TABS_CLASSNAME} value="params">Params</TabsTrigger>
                <TabsTrigger className={TABS_CLASSNAME} value="body">Body</TabsTrigger>
                <TabsTrigger className={TABS_CLASSNAME} value="headers">Headers</TabsTrigger>
                <TabsTrigger className={TABS_CLASSNAME} value="auth">Auth</TabsTrigger>
                <TabsTrigger className={TABS_CLASSNAME} value='settings'>Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="params">
                <RequestParametersForm />
              </TabsContent>
              <TabsContent value="body">
                <RequestBodyForm />
              </TabsContent>
              <TabsContent value="headers">
                <RequestHeadersForm />
              </TabsContent>
              <TabsContent value="auth">
                <h1 className='text-5xl'>Auth</h1>
              </TabsContent>
              <TabsContent value="settings">
                <h1 className='text-5xl'>Settings</h1>
              </TabsContent>
            </Tabs>
          </div>

          <div className='bg-slate-100 rounded-md p-4 mt-8 overflow-scroll max-h-[500px] relative'>
            <p className='text-sm text-right top-2 right-2 opacity-60 absolute'>{status}</p>
            {responseData.type === ResponseTypesEnum.json && (
              <pre className='text-sm'>{JSON.stringify(responseData.data, null, 3)}</pre>
            )}

            {responseData.type === ResponseTypesEnum.audio && (
              <audio controls src={responseData.data as string} />
            )}

            {
              (
                responseData.type === ResponseTypesEnum.html ||
                responseData.type === ResponseTypesEnum.text
              ) && (
                <>
                  <p>An Iframe should be here</p>
                  <div className='divide-y my-4' />
                  <pre>{(responseData.data as string)}...</pre>
                </>
              )
            }

            {responseData.type === ResponseTypesEnum.video && (
              <video controls src={responseData.data as string} className='w-full h-full' />
            )}

            {responseData.type === ResponseTypesEnum.image && (
              <Image src={responseData.data as string} className='w-full h-full object-contain' alt='response image' width={500} height={500} />
            )}

            <div>

            </div>
          </div>
        </form>
      </FormProvider>
    </main >
  )
}
