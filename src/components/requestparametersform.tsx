import * as React from 'react'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { RequestFormType } from '@/types/form'



export function RequestParametersForm() {

    const { control } = useFormContext<RequestFormType>()
    const { fields, append } = useFieldArray<RequestFormType>({
        control: control,
        name: 'params',
    })

    // const url = useWatch<RequestFormType>({ control, name: 'url' })

    return (
        <div className='py-4 space-y-2'>
            {fields.map((field, i) => <ParamsRow i={i} key={field.id} />)}
            <div>
                <Button type='button' onClick={() => append({ key: '', value: '', description: '' })} className='ml-auto'>Add Row <PlusIcon /></Button>
            </div>
        </div>
    )
}

function ParamsRow({ i }: { i: number }) {

    const { control, register, setValue, getValues } = useFormContext<RequestFormType>()

    const paramRow = useWatch<RequestFormType>({ name: `params.${i}`, control })

    React.useEffect(() => {
        if (getValues('url')) {
            const params = getValues('params')
            const oldUrl = new URL(getValues('url'))
            const oldUrlHref = oldUrl.origin + oldUrl.pathname
            const newUrl = new URL(oldUrlHref)

            params?.map(p => {
                if (p.key) {
                    newUrl.searchParams.append(p.key, p.value)
                }
            })

            setValue('url', newUrl.toString())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramRow])

    const deleteRow = () => {
        const allParams = getValues('params')
        setValue('params', allParams?.filter((_, _i) => _i !== i))
    }

    return (
        <div className='grid grid-cols-[1fr,1fr,1fr,36px] gap-2'>
            <Input placeholder='Key'  {...register(`params.${i}.key`)} />
            <Input placeholder='Value' {...register(`params.${i}.value`)} />
            <Input placeholder='Description' {...register(`params.${i}.description`)} />
            <Button type='button' variant='destructive' className='p-0' onClick={deleteRow}>
                <TrashIcon />
            </Button>

        </div>
    )
}