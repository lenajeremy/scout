import * as React from 'react'
import { BackpackIcon } from '@radix-ui/react-icons'
import { useAppDispatch, useAppSelector } from '@/store'
import { addRequestTab } from '@/store/actions'
import { buildSidebarStructure, createNewFolder, createNewRequest, setActiveCollection, setActiveFolder, updateStoreFromCollection } from '@/lib/utils'
import { SidebarCollection, SidebarFolder } from '@/types/sidebar'
import { Request } from '@/types/collection'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'

export function Sidebar() {

    const requests = useAppSelector(store => store.requests)
    const { collections } = useAppSelector(store => store.collections)
    const { folders } = useAppSelector(store => store.folders)
    const dispatch = useAppDispatch()

    const repoStructure = React.useMemo(() => buildSidebarStructure(collections, folders, requests), [collections, folders, requests])
    const { handleSubmit, register } = useForm<{ collectionUrl: string, type: 'postman' | 'swagger' }>({
        defaultValues: {
            type: 'postman',
            collectionUrl: ''
        }
    })

    const [loading, setLoading] = React.useState(false)
    const [collectionJSON, setCollectionJSON] = React.useState<any>()

    const importPostmanCollectionFromURL: SubmitHandler<{ collectionUrl: string }> = React.useCallback(async (values) => {
        try {
            setLoading(true)
            const res = await fetch(values.collectionUrl)
            const collectionJSON = await res.json()
            setCollectionJSON(collectionJSON)
            updateStoreFromCollection(collectionJSON, dispatch)

        } catch (error) {
            console.error(error)
            alert(error)
        } finally {
            setLoading(false)
        }
    }, [])



    return (
        <div className='pt-8 pr-4 pl-4 flex flex-col h-screen overflow-scroll'>
            <div>
                <svg width="100" height="70" viewBox="0 0 525 189" fill="none" xmlns="http://www.w3.org/2000/svg" className='-mt-6 -ml-1'>
                    <g clipPath="url(#clip0_257_2)">
                        <rect width="524.293" height="176.029" transform="translate(0.353367 12.9706)" className='fill-white dark:fill-[#1e1e1e]' />
                        <path d="M73.3141 182.042C53.2044 182.042 40.3152 174.012 36.4013 163.349C35.7264 161.595 35.3215 159.705 35.3215 157.883C35.3215 152.485 39.0331 148.908 44.2967 148.908C48.4806 148.908 51.2474 150.528 53.6767 154.847C56.8484 162.27 64.4739 165.644 73.7865 165.644C84.7186 165.644 92.1417 160.38 92.1417 153.227C92.1417 146.816 87.5529 143.172 75.3386 140.675L65.0138 138.651C45.5789 134.804 36.0638 125.492 36.0638 110.983C36.0638 93.1677 51.5848 81.3583 73.2466 81.3583C91.062 81.3583 104.491 88.8489 108.81 101.536C109.282 102.885 109.552 104.302 109.552 106.057C109.552 110.916 106.043 114.222 100.847 114.222C96.2581 114.222 93.4239 112.4 91.1295 108.216C87.8903 100.861 81.6144 97.824 73.2466 97.824C63.1918 97.824 56.511 102.548 56.511 109.701C56.511 115.707 61.1673 119.418 72.7068 121.713L82.9641 123.805C103.614 127.921 112.521 136.221 112.521 151C112.521 170.03 97.6078 182.042 73.3141 182.042ZM168.397 182.042C139.514 182.042 121.969 163.147 121.969 131.7C121.969 100.321 139.852 81.3583 167.857 81.3583C186.077 81.3583 200.181 89.4562 206.862 103.493C208.211 106.057 208.886 108.689 208.886 111.118C208.886 116.449 205.31 119.891 199.911 119.891C195.322 119.891 192.42 117.866 190.194 113.143C185.74 103.223 177.777 98.2289 168.059 98.2289C152.673 98.2289 142.753 111.118 142.753 131.633C142.753 152.417 152.538 165.239 168.127 165.239C178.384 165.239 186.077 160.583 190.464 150.798C192.555 146.209 195.12 144.387 199.439 144.387C205.175 144.387 208.954 148.031 208.954 153.429C208.954 155.724 208.414 157.883 207.402 160.245C201.328 173.742 186.819 182.042 168.397 182.042ZM267.461 182.042C238.578 182.042 220.493 162.742 220.493 131.768C220.493 100.726 238.578 81.3583 267.461 81.3583C296.276 81.3583 314.429 100.726 314.429 131.768C314.429 162.742 296.276 182.042 267.461 182.042ZM267.461 165.036C283.387 165.036 293.577 152.147 293.577 131.768C293.577 111.32 283.387 98.3639 267.461 98.3639C251.535 98.3639 241.278 111.32 241.278 131.768C241.278 152.147 251.468 165.036 267.461 165.036ZM368.414 182.042C343.446 182.042 327.588 167.466 327.588 146.006V92.3579C327.588 85.6097 331.367 81.6957 337.777 81.6957C344.188 81.6957 347.967 85.6097 347.967 92.3579V143.982C347.967 156.466 355.323 164.632 368.414 164.632C381.439 164.632 388.794 156.466 388.794 143.982V92.3579C388.794 85.6097 392.573 81.6957 398.984 81.6957C405.395 81.6957 409.174 85.6097 409.174 92.3579V146.006C409.174 167.466 393.315 182.042 368.414 182.042ZM458.908 181.705C452.498 181.705 448.719 177.791 448.719 171.11V99.916H428.609C423.075 99.916 419.364 96.7443 419.364 91.4807C419.364 86.217 423.008 83.0454 428.609 83.0454H489.275C494.809 83.0454 498.453 86.217 498.453 91.4807C498.453 96.7443 494.741 99.916 489.275 99.916H469.098V171.11C469.098 177.791 465.319 181.705 458.908 181.705Z" fill="#23A79F" />
                    </g>
                    <g clipPath="url(#clip1_257_2)">
                        <rect width="524.293" height="172.324" transform="translate(0.353367)" className='fill-white dark:fill-[#1e1e1e]' />
                        <path d="M73.3141 171.559C53.2044 171.559 40.3152 163.529 36.4013 152.867C35.7264 151.112 35.3215 149.223 35.3215 147.401C35.3215 142.002 39.0331 138.425 44.2967 138.425C48.4806 138.425 51.2474 140.045 53.6767 144.364C56.8484 151.787 64.4739 155.161 73.7865 155.161C84.7186 155.161 92.1417 149.897 92.1417 142.744C92.1417 136.333 87.5529 132.689 75.3386 130.193L65.0138 128.168C45.5789 124.322 36.0638 115.009 36.0638 100.5C36.0638 82.6849 51.5848 70.8755 73.2466 70.8755C91.062 70.8755 104.491 78.3661 108.81 91.0527C109.282 92.4024 109.552 93.8195 109.552 95.5741C109.552 100.433 106.043 103.739 100.847 103.739C96.2581 103.739 93.4239 101.917 91.1295 97.7335C87.8903 90.3779 81.6144 87.3412 73.2466 87.3412C63.1918 87.3412 56.511 92.065 56.511 99.2181C56.511 105.224 61.1673 108.936 72.7068 111.23L82.9641 113.322C103.614 117.438 112.521 125.739 112.521 140.517C112.521 159.547 97.6078 171.559 73.3141 171.559ZM168.397 171.559C139.514 171.559 121.969 152.664 121.969 121.217C121.969 89.8381 139.852 70.8755 167.857 70.8755C186.077 70.8755 200.181 78.9734 206.862 93.0097C208.211 95.5741 208.886 98.2059 208.886 100.635C208.886 105.966 205.31 109.408 199.911 109.408C195.322 109.408 192.42 107.383 190.194 102.66C185.74 92.7398 177.777 87.7461 168.059 87.7461C152.673 87.7461 142.753 100.635 142.753 121.15C142.753 141.934 152.538 154.756 168.127 154.756C178.384 154.756 186.077 150.1 190.464 140.315C192.555 135.726 195.12 133.904 199.439 133.904C205.175 133.904 208.954 137.548 208.954 142.947C208.954 145.241 208.414 147.401 207.402 149.762C201.328 163.259 186.819 171.559 168.397 171.559ZM267.461 171.559C238.578 171.559 220.493 152.259 220.493 121.285C220.493 90.243 238.578 70.8755 267.461 70.8755C296.276 70.8755 314.429 90.243 314.429 121.285C314.429 152.259 296.276 171.559 267.461 171.559ZM267.461 154.554C283.387 154.554 293.577 141.665 293.577 121.285C293.577 100.838 283.387 87.8811 267.461 87.8811C251.535 87.8811 241.278 100.838 241.278 121.285C241.278 141.665 251.468 154.554 267.461 154.554ZM368.414 171.559C343.446 171.559 327.588 156.983 327.588 135.524V81.8751C327.588 75.1269 331.367 71.2129 337.777 71.2129C344.188 71.2129 347.967 75.1269 347.967 81.8751V133.499C347.967 145.983 355.323 154.149 368.414 154.149C381.439 154.149 388.794 145.983 388.794 133.499V81.8751C388.794 75.1269 392.573 71.2129 398.984 71.2129C405.395 71.2129 409.174 75.1269 409.174 81.8751V135.524C409.174 156.983 393.315 171.559 368.414 171.559ZM458.908 171.222C452.498 171.222 448.719 167.308 448.719 160.627V89.4332H428.609C423.075 89.4332 419.364 86.2615 419.364 80.9979C419.364 75.7343 423.008 72.5626 428.609 72.5626H489.275C494.809 72.5626 498.453 75.7343 498.453 80.9979C498.453 86.2615 494.741 89.4332 489.275 89.4332H469.098V160.627C469.098 167.308 465.319 171.222 458.908 171.222Z" className='fill-[#1e1e1e] dark:fill-neutral-300' />
                    </g>
                    <defs>
                        <clipPath id="clip0_257_2">
                            <rect width="524.293" height="176.029" className='fill-white dark:fill-[#1e1e1e]' transform="translate(0.353367 12.9706)" />
                        </clipPath>
                        <clipPath id="clip1_257_2">
                            <rect width="524.293" height="172.324" className='fill-white dark:fill-[#1e1e1e]' transform="translate(0.353367)" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div className='flex flex-col flex-1 justify-between pb-4'>
                <div className='flex flex-col gap-3 mt-4'>
                    {
                        repoStructure.map(c => <SidebarCollectionComponent key={c.id} {...{ ...c }} />)
                    }
                </div>

                <div className='flex flex-col gap-4'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={'secondary'}>Import from Postman </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Import from Postman</DialogTitle>
                                <DialogDescription>
                                    Bring your Postman collection to Scout easily.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(importPostmanCollectionFromURL)}>
                                <div className="flex flex-col gap-1 my-4">
                                    <Label htmlFor="postmanCollectionUrl" className="text-sm">
                                        Collection URL:
                                    </Label>
                                    <Input
                                        id="postmanCollectionUrl"
                                        className="col-span-3"
                                        type='url'
                                        {...register('collectionUrl', { required: true })}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button loading={loading} loadingText='Fetching collection from URL...' type="submit" className='w-full' >Import</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button>Import from Swagger</Button>
                </div>
            </div>
        </div>
    )
}

function SidebarCollectionComponent(props: SidebarCollection) {
    const dispatch = useAppDispatch()
    const { activeCollectionId } = useAppSelector(store => store.collections)
    const [open, setOpen] = React.useState(true)
    return (
        <div className={`${activeCollectionId === props.id ? '' : ''}`}>
            <button onClick={() => {
                setActiveCollection(dispatch, props.id)
                setOpen(!open)
            }}>{props.name}</button>
            {
                open && (
                    <div className='flex flex-col ml-4'>
                        {props.folders.map(folder => <SidebarFolderComponent key={folder.id} {...{ ...folder }} />)}
                        {props.requests.map((request) => <SidebarRequestComponent key={request.id} {...{ ...request }} />)}
                    </div>
                )
            }

        </div >
    )
}

function SidebarFolderComponent(folder: SidebarFolder) {
    const dispatch = useAppDispatch()
    const [open, setOpen] = React.useState(true)

    return (
        <div>
            <div className='flex items-center justify-between w-full'>
                <button className='flex gap-2 items-center' onClick={() => {
                    setActiveFolder(dispatch, folder.id, folder.collectionId)
                    setOpen(!open)
                }}>
                    <BackpackIcon />
                    <span>
                        {folder.name}
                    </span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'} size='icon'>
                            <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => createNewFolder(dispatch, folder.collectionId, folder.id)}>
                            New Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => createNewRequest(dispatch, folder.collectionId, folder.id)}>
                            New Request
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Share
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {
                open && (
                    <div className='ml-4'>
                        {folder.subFolders.map(folder => (<SidebarFolderComponent key={folder.id} {...{ ...folder }} />))}
                        {folder.requests.map((request) => <SidebarRequestComponent key={request.id} {...{ ...request }} />)}
                    </div>
                )
            }

        </div >
    )
}

function SidebarRequestComponent(request: Request) {
    const { activeTabId } = useAppSelector(store => store.tabs)
    const dispatch = useAppDispatch()
    return (
        <div key={request.id} className={`relative py-1 border-l-2 ${request.id === activeTabId ? 'border-orange-500' : 'border-transparent'}`}>
            <button
                className='flex items-center gap-2 text-sm'
                onClick={() => dispatch(addRequestTab({ name: request.name, id: request.id }))}
            >
                <span className={`text-green-400 w-10 text-left`}>{request.method.toUpperCase()}</span> {request.name}
            </button>
        </div>
    )
}