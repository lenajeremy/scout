import { Request } from '@/types/collection'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from './ui/button'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { Input } from './ui/input'

export function RequestHeadersForm() {
    const { control } = useFormContext<Request>()
    const { fields, append } = useFieldArray<Request>({
        control: control,
        name: 'headers',
    })

    return (
        <div className='my-4 space-y-2'>
            {fields.map((field, i) => <HeadersRow i={i} key={field.id} />)}
            <div>
                <Button type='button' onClick={() => append({ key: '', value: '' })} className='ml-auto'>Add Row <PlusIcon /></Button>
            </div>
        </div>
    )
}

function HeadersRow({ i }: { i: number }) {

    const {  register, setValue, getValues } = useFormContext<Request>()

    const deleteRow = () => {
        const allParams = getValues('headers')
        setValue('headers', allParams?.filter((_, _i) => _i !== i))
    }

    return (
        <div className='grid grid-cols-[1fr,1fr,36px] gap-2'>
            <Input placeholder='Key'  {...register(`headers.${i}.key`)} />
            <Input placeholder='Value' {...register(`headers.${i}.value`)} />
            <Button type='button' variant='destructive' className='p-0' onClick={deleteRow}>
                <TrashIcon />
            </Button>

        </div>
    )
}
