import * as React from 'react'
import { Input } from './ui/input'
import { RequestBodyEnum, RequestFormType } from '@/types/form'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import MonacoEditor from '@monaco-editor/react'


export function RequestBodyForm(props: any) {

    const { setValue, watch, register, getValues } = useFormContext<RequestFormType>()
    const requestBodyType = watch('bodyType')
    const jsonBody = watch('jsonBody')

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
                    <p className='text-gray-500 text-center text-sm mt-6'>This request has no body</p>
                )
            case RequestBodyEnum.json:
                return (
                    <MonacoEditor
                        className='h-48'
                        defaultLanguage='json'
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
                    <pre>BINARY</pre>
                )
            default:
                return (
                    <pre>Wrong selection... select another option</pre>
                )
        }
    }


    return (
        <div className='divide-y'>
            <div className='px-4 py-3'>
                <RadioGroup defaultValue={requestBodyType} className='flex gap-3' onValueChange={(value) => setValue('bodyType', value as RequestBodyEnum)}>
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
            <div className='py-3'>
                {getBodyComponentFromSelectedType()}
            </div>
        </div>
    )
}

const FormDataForm = () => {
    const { control } = useFormContext<RequestFormType>()
    const { fields, append } = useFieldArray<RequestFormType>({ control, name: 'formData' })

    return (
        <div className='space-y-2'>
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

    const { register, watch, setValue } = useFormContext<RequestFormType>()
    const rowType = watch(`formData.${index}.type`)
    const rowValue = watch(`formData.${index}.value`)

    return (
        <div className='grid grid-cols-[1fr,1fr,1fr,36px] gap-2'>
            <div className='relative'>
                <Input placeholder='Key'  {...register(`formData.${index}.key`)} />
                <button type='button' className='absolute w-8 h-8 rounded-full right-0 top-1/2 -translate-y-1/2' onClick={() => {
                    if (rowType === 'text') {
                        setValue(`formData.${index}.type`, 'file')
                    } else {
                        setValue(`formData.${index}.type`, 'text')
                    }
                }}>
                    {rowType.charAt(0).toUpperCase()}
                </button>
            </div>
            <Input placeholder='Value' type={rowType} {...register(`formData.${index}.value`)} multiple />
            <Input placeholder='Description' {...register(`formData.${index}.description`)} />
            <Button type='button' variant='destructive' className='p-0'>
                <TrashIcon />
            </Button>

        </div>
    )
}