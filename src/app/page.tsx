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
import MonacoEditor from '@monaco-editor/react'
import { Sidebar } from '@/components/sidebar'
import { REQUEST_DEFAULT_VALUES, RequestsManagerContext } from '@/contexts/requestsmanager'
import { useTheme } from 'next-themes'
import { ModeToggle } from '@/components/ui/theme-switcher'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { v4 as uuid } from 'uuid'


const TABS_CLASSNAME = 'w-full overflow-hidden relative data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0'
const isFile = (d: BodyFormData[number]): d is { key: string, value: FileList, type: 'file' } => {
  return d.type === 'file'
}


type WithoutPromise<T> = T extends Promise<infer T> ? T : never


export default function Home() {

  const [responseData, setResponseData] = React.useState<WithoutPromise<ReturnType<typeof getResponseData>>>({ data: null, type: ResponseTypesEnum.json });
  const [status, setStatus] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false);
  const { saveRequest, activeRequest, initRequests, updateActiveRequest } = React.useContext(RequestsManagerContext)
  const formMethods = useForm<RequestFormType>({
    defaultValues: REQUEST_DEFAULT_VALUES
  })

  React.useEffect(() => {
    const localStoredRequests: Array<RequestFormType> = JSON.parse(localStorage.getItem('requests') || '[]')
    initRequests(localStoredRequests)
  }, [])

  const { resolvedTheme } = useTheme()


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
      }
    } catch (error) {
      alert(error)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!activeRequest) return

    for (let [key, value] of Object.entries(activeRequest)) {
      // @ts-ignore
      formMethods.setValue(key, value)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRequest])

  return (
    <FormProvider {...formMethods} >
      <div className='grid grid-cols-[300px,_1px,_1fr,_1px,_64px] min-h-screen mx-auto'>
        <Sidebar />
        <div className='h-full w-full bg-neutral-200 dark:bg-neutral-700' />
        <main className='pt-8'>
          <form onSubmit={formMethods.handleSubmit(makeRequest)} autoComplete='on' className='h-full'>
            <div className='flex items-center gap-2 px-4'>
              <Select
                // @ts-ignore
                options={REQUEST_METHODS}
                onChange={option => formMethods.setValue('method', option as RequestMethod)}
                placeholder='Request Method'
                searchPlaceholder='Search request method'
                defaultValue={formMethods.getValues('method')}
              />
              {/* <pre>{method}</pre> */}
              <Input
                type='url'
                placeholder='Enter request url'
                className='outline-none'
                autoFocus
                {...formMethods.register('url', { required: true })}
              />

              <Input
                type='text'
                placeholder='Enter request name'
                className='outline-none w-60'
                autoFocus
                {...formMethods.register('name', { required: true })}
              />

              <Button loading={loading} disabled={loading} type='submit'>Send</Button>
              <Button onClick={() => {
                const newRequest = formMethods.getValues()
                saveRequest(newRequest)
              }} type='button'>Save</Button>
            </div>

            <div className='h-[1px] w-full bg-neutral-200 dark:bg-neutral-700 my-4' />

            <div>
              <Tabs defaultValue="params">

                <TabsList className='mx-4 w-[calc(100%-32px)]'>
                  <TabsTrigger className={TABS_CLASSNAME} value="params">Params</TabsTrigger>
                  <TabsTrigger className={TABS_CLASSNAME} value="body">Body</TabsTrigger>
                  <TabsTrigger className={TABS_CLASSNAME} value="headers">Headers</TabsTrigger>
                  <TabsTrigger className={TABS_CLASSNAME} value="auth">Auth</TabsTrigger>
                  <TabsTrigger className={TABS_CLASSNAME} value='settings'>Settings</TabsTrigger>
                </TabsList>

                <div className='h-96 overflow-scroll'>
                  <TabsContent value="params" className='h-full px-4 m-0'>
                    <RequestParametersForm />
                  </TabsContent>
                  <TabsContent value="body" className='h-full m-0'>
                    <RequestBodyForm />
                  </TabsContent>
                  <TabsContent value="headers" className='h-full px-4'>
                    <RequestHeadersForm />
                  </TabsContent>
                  <TabsContent value="auth" className='h-full px-4'>
                    <h1 className='text-5xl'>Auth</h1>
                  </TabsContent>
                  <TabsContent value="settings" className='h-full px-4'>
                    <h1 className='text-5xl'>Settings</h1>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <div className='h-[1px] w-full bg-neutral-200 dark:bg-neutral-700 my-4' />

            <div className='relative h-96'>
              <code className='text-[12px] text-right top-0 right-5 opacity-60 w-full block absolute z-50'>{status}</code>
              {responseData.type === ResponseTypesEnum.json && (
                <MonacoEditor
                  className='h-full'
                  defaultLanguage='json'
                  theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                  value={JSON.stringify(responseData.data, null, 3)}
                  options={{ minimap: { enabled: false }, readOnly: true, wordWrap: 'on' }}
                />
              )}

              {responseData.type === ResponseTypesEnum.audio && (
                <audio controls src={responseData.data as string} />
              )}

              {
                responseData.type === ResponseTypesEnum.html && (
                  <iframe className='w-full h-96' srcDoc={responseData.data as string} />
                )
              }

              {
                responseData.type === ResponseTypesEnum.text && (
                  <p>{(responseData.data as string)}...</p>
                )
              }

              {responseData.type === ResponseTypesEnum.video && (
                <video controls src={responseData.data as string} className='w-full h-full' />
              )}

              {responseData.type === ResponseTypesEnum.image && (
                <Image src={responseData.data as string} className='w-full h-full object-contain' alt='response image' width={500} height={500} />
              )}

            </div>
          </form>
        </main >

        <div className='h-full w-full bg-neutral-200 dark:bg-neutral-700' />

        <div className='mt-4 flex flex-col gap-2 ml-4'>
          <ModeToggle />
          <Button size={'icon'} className='text-sm' variant={'outline'} onClick={() => {
            const newRequest = { ...REQUEST_DEFAULT_VALUES, id: uuid() }
            updateActiveRequest(newRequest)
            saveRequest(newRequest)
          }}>
            <PlusCircledIcon />
          </Button>
        </div>
      </div>
    </FormProvider>
  )
}
