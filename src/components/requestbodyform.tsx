import * as React from 'react'
import { Input } from './ui/input'
import { RequestBodyEnum, RequestFormType } from '@/types/form'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import MonacoEditor from '@monaco-editor/react'
import loader from '@monaco-editor/loader';
import { useTheme } from 'next-themes'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu'


loader.config({ paths: { vs: 'http://localhost:3000/min/vs' } });


export function RequestBodyForm() {

    const { setValue, watch, getValues } = useFormContext<RequestFormType>()
    const requestBodyType = watch('bodyType')
    const jsonBody = watch('jsonBody')
    const { resolvedTheme } = useTheme()

    React.useEffect(() => {
        const headers = getValues('headers')
        const contentTypeIndex = headers.findIndex(header => header.key.toLowerCase() === 'content-type')
        if (requestBodyType === RequestBodyEnum.json) {
            if (contentTypeIndex === -1) {
                setValue('headers', [...headers, { key: 'Content-Type', value: 'application/json' }])
            } else {
                setValue('headers', headers.map((header, i) => i === contentTypeIndex ? ({ key: header.key, value: 'application/json' }) : header))
            }
        } else if (requestBodyType === RequestBodyEnum.formData) {
            if (contentTypeIndex === -1) {
                setValue('headers', [...headers, { key: 'Content-Type', value: 'multipart/form-data' }])
            } else {
                setValue('headers', headers.map((header, i) => i === contentTypeIndex ? ({ key: header.key, value: 'multipart/form-data' }) : header))
            }
        } else if (requestBodyType === RequestBodyEnum.none) {
            if (contentTypeIndex === -1) { }
            else setValue('headers', headers.filter((_, i) => i !== contentTypeIndex))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestBodyType])


    const getBodyComponentFromSelectedType = () => {
        switch (requestBodyType) {
            case RequestBodyEnum.none:
                return (
                    <div className='flex h-full items-center justify-center'>
                        <p className='text-sm'>This request has no body</p>
                    </div>
                )
            case RequestBodyEnum.json:
                return (
                    <MonacoEditor
                        className='h-full'
                        defaultLanguage='json'
                        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                        defaultValue={jsonBody}
                        onChange={(value) => setValue('jsonBody', String(value))}
                        options={{ minimap: { enabled: false } }}
                    />
                )
            case RequestBodyEnum.formData:
                return (
                    <FormDataForm />
                )
            case RequestBodyEnum.binary:
                return (
                    <div className='flex h-full items-center justify-center'>
                        <p className='text-sm'>This request accept binary body</p>
                    </div>
                )
            default:
                return (
                    <pre>Wrong selection... select another option</pre>
                )
        }
    }



    return (
        <div className='flex flex-col h-full pt-2'>
            <div className='px-4 pt-2'>
                <RadioGroup value={requestBodyType} className='flex gap-3' onValueChange={(value) => setValue('bodyType', value as RequestBodyEnum)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={RequestBodyEnum.none} id="r1" />
                        <Label htmlFor="r1">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={RequestBodyEnum.json} id="r2" />
                        <Label htmlFor="r2">JSON</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={RequestBodyEnum.formData} id="r3" />
                        <Label htmlFor="r3">Form data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={RequestBodyEnum.binary} id="r4" />
                        <Label htmlFor="r4">Binary</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className='h-[1px] w-full bg-neutral-200 dark:bg-neutral-700 mt-4' />

            <div className='flex-1 pt-4'>
                {getBodyComponentFromSelectedType()}
            </div>
        </div>
    )
}

const FormDataForm = () => {
    const { control } = useFormContext<RequestFormType>()
    const { fields, append } = useFieldArray<RequestFormType>({ control, name: 'formData' })

    return (
        <div className='space-y-2 w-full px-4'>
            {fields.map((field, index) => (
                <FormDataRow key={field.id} index={index} />
            ))}
            <div>
                <Button type='button' onClick={() => append({ key: '', value: '', description: '', type: 'text' })} className='ml-auto'>Add Row <PlusIcon /></Button>
            </div>
        </div>
    )
}

const FormDataRow = ({ index }: { index: number }) => {

    const { register, watch, setValue, getValues } = useFormContext<RequestFormType>()
    const rowType = watch(`formData.${index}.type`)

    const deleteRow = () => {
        const formData = getValues('formData')
        setValue('formData', formData?.filter((_, _i) => _i !== index))
    }


    return (
        <div className='grid grid-cols-[1fr,1fr,1fr,36px] gap-2'>
            <div className='relative'>
                <Input placeholder='Key'  {...register(`formData.${index}.key`)} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className='absolute right-2 h-2/3 w-[48px] top-1/2 -translate-y-1/2'>
                            <span className='text-[12px] font-normal'>{rowType.charAt(0).toUpperCase() + rowType.slice(1)}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setValue(`formData.${index}.type`, "text")}>
                            Text
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setValue(`formData.${index}.type`, "file")}>
                            File
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Input placeholder='Value' type={rowType} {...register(`formData.${index}.value`)} multiple />
            <Input placeholder='Description' {...register(`formData.${index}.description`)} />
            <Button type='button' variant='destructive' className='p-0' onClick={deleteRow}>
                <TrashIcon />
            </Button>

        </div>
    )
}