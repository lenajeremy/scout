import { REQUEST_DEFAULT_VALUES, RequestsManagerContext } from '@/contexts/requestsmanager'
import { RequestFormType } from '@/types/form'
import { TrashIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export function Sidebar() {

    const { requests, removeRequest, updateActiveRequest, addRequest } = React.useContext(RequestsManagerContext)
    const { setValue } = useFormContext<RequestFormType>()

    return (
        <div className='px-10'>
            <div>
                <svg width="120" height="70" viewBox="0 0 653 210" fill="none" xmlns="http://www.w3.org/2000/svg" className='-mt-5'>
                    <g clip-path="url(#clip0_249_18)">
                        <rect width="653" height="195.079" transform="translate(0 14.9214)" fill="white" />
                        <path d="M51.8514 200.348C45.0932 200.348 41.0828 196.264 41.0828 189.134V101.5C41.0828 94.3702 45.2417 90.2855 52.3713 90.2855C56.9758 90.2855 60.095 92.1422 63.5112 96.821L109.853 161.581H110.448V101.574C110.448 94.3702 114.458 90.2855 121.216 90.2855C127.974 90.2855 131.911 94.3702 131.911 101.574V189.431C131.911 196.412 127.974 200.348 120.919 200.348C116.092 200.348 113.121 198.64 109.705 193.887L63.2142 128.755H62.5458V189.134C62.5458 196.264 58.5354 200.348 51.8514 200.348ZM161.023 198.937C153.968 198.937 149.809 194.63 149.809 187.203V103.431C149.809 96.0783 153.968 91.7709 161.023 91.7709H211.97C218.134 91.7709 222.144 95.2614 222.144 101.054C222.144 106.847 218.059 110.337 211.97 110.337H172.237V136.108H210.039C215.609 136.108 219.396 139.376 219.396 144.723C219.396 150.07 215.683 153.338 210.039 153.338H172.237V180.371H211.97C218.059 180.371 222.144 183.861 222.144 189.654C222.144 195.447 218.134 198.937 211.97 198.937H161.023ZM248.212 198.937C241.156 198.937 236.997 194.63 236.997 187.203V103.431C236.997 96.0783 241.156 91.7709 248.212 91.7709H283.637C303.763 91.7709 316.388 102.094 316.388 118.507C316.388 130.241 307.625 140.044 296.262 141.752V142.346C310.818 143.46 321.512 154.08 321.512 168.265C321.512 187.129 307.328 198.937 284.454 198.937H248.212ZM259.426 136.331H275.542C287.498 136.331 294.331 131.058 294.331 121.997C294.331 113.382 288.315 108.481 277.844 108.481H259.426V136.331ZM259.426 182.227H278.735C291.657 182.227 298.638 176.732 298.638 166.483C298.638 156.457 291.435 151.11 278.215 151.11H259.426V182.227ZM379.217 200.72C351.739 200.72 334.286 184.678 334.286 161.061V102.02C334.286 94.593 338.445 90.2855 345.5 90.2855C352.556 90.2855 356.715 94.593 356.715 102.02V158.833C356.715 172.573 364.81 181.559 379.217 181.559C393.551 181.559 401.646 172.573 401.646 158.833V102.02C401.646 94.593 405.805 90.2855 412.86 90.2855C419.915 90.2855 424.074 94.593 424.074 102.02V161.061C424.074 184.678 406.622 200.72 379.217 200.72ZM453.187 198.937C446.131 198.937 441.972 194.63 441.972 187.203V102.02C441.972 94.593 446.131 90.2855 453.187 90.2855C460.242 90.2855 464.401 94.593 464.401 102.02V180.371H502.425C508.515 180.371 512.6 183.861 512.6 189.654C512.6 195.447 508.589 198.937 502.425 198.937H453.187ZM531.686 200.348C524.705 200.348 520.323 196.264 520.323 189.802C520.323 187.946 520.843 185.421 521.809 182.673L551.07 102.985C554.189 94.2959 559.462 90.2855 567.928 90.2855C576.691 90.2855 581.89 94.1474 585.084 102.911L614.493 182.673C615.533 185.569 615.904 187.574 615.904 189.802C615.904 195.966 611.225 200.348 604.69 200.348C598.377 200.348 595.035 197.452 593.03 190.471L587.386 173.538H548.693L543.049 190.248C540.969 197.378 537.627 200.348 531.686 200.348ZM553.595 156.16H582.187L568.002 112.268H567.482L553.595 156.16Z" fill="#23A79F" />
                    </g>
                    <g clip-path="url(#clip1_249_18)">
                        <rect width="653" height="190.972" transform="translate(0 0.54718)" fill="white" />
                        <path d="M51.8514 188.712C45.0932 188.712 41.0828 184.627 41.0828 177.498V89.8634C41.0828 82.7339 45.2417 78.6492 52.3713 78.6492C56.9758 78.6492 60.095 80.5059 63.5112 85.1847L109.853 149.945H110.448V89.9377C110.448 82.7339 114.458 78.6492 121.216 78.6492C127.974 78.6492 131.911 82.7339 131.911 89.9377V177.795C131.911 184.776 127.974 188.712 120.919 188.712C116.092 188.712 113.121 187.004 109.705 182.251L63.2142 117.119H62.5458V177.498C62.5458 184.627 58.5354 188.712 51.8514 188.712ZM161.023 187.301C153.968 187.301 149.809 182.993 149.809 175.567V91.7944C149.809 84.442 153.968 80.1346 161.023 80.1346H211.97C218.134 80.1346 222.144 83.6251 222.144 89.4178C222.144 95.2106 218.059 98.7011 211.97 98.7011H172.237V124.472H210.039C215.609 124.472 219.396 127.739 219.396 133.086C219.396 138.434 215.683 141.701 210.039 141.701H172.237V168.734H211.97C218.059 168.734 222.144 172.225 222.144 178.018C222.144 183.81 218.134 187.301 211.97 187.301H161.023ZM248.212 187.301C241.156 187.301 236.997 182.993 236.997 175.567V91.7944C236.997 84.442 241.156 80.1346 248.212 80.1346H283.637C303.763 80.1346 316.388 90.4576 316.388 106.87C316.388 118.605 307.625 128.408 296.262 130.116V130.71C310.818 131.824 321.512 142.444 321.512 156.629C321.512 175.492 307.328 187.301 284.454 187.301H248.212ZM259.426 124.694H275.542C287.498 124.694 294.331 119.421 294.331 110.361C294.331 101.746 288.315 96.8445 277.844 96.8445H259.426V124.694ZM259.426 170.591H278.735C291.657 170.591 298.638 165.095 298.638 154.846C298.638 144.821 291.435 139.473 278.215 139.473H259.426V170.591ZM379.217 189.083C351.739 189.083 334.286 173.042 334.286 149.425V90.3833C334.286 82.9567 338.445 78.6492 345.5 78.6492C352.556 78.6492 356.715 82.9567 356.715 90.3833V147.197C356.715 160.936 364.81 169.923 379.217 169.923C393.551 169.923 401.646 160.936 401.646 147.197V90.3833C401.646 82.9567 405.805 78.6492 412.86 78.6492C419.915 78.6492 424.074 82.9567 424.074 90.3833V149.425C424.074 173.042 406.622 189.083 379.217 189.083ZM453.187 187.301C446.131 187.301 441.972 182.993 441.972 175.567V90.3833C441.972 82.9567 446.131 78.6492 453.187 78.6492C460.242 78.6492 464.401 82.9567 464.401 90.3833V168.734H502.425C508.515 168.734 512.6 172.225 512.6 178.018C512.6 183.81 508.589 187.301 502.425 187.301H453.187ZM531.686 188.712C524.705 188.712 520.323 184.627 520.323 178.166C520.323 176.309 520.843 173.784 521.809 171.037L551.07 91.3488C554.189 82.6596 559.462 78.6492 567.928 78.6492C576.691 78.6492 581.89 82.5111 585.084 91.2745L614.493 171.037C615.533 173.933 615.904 175.938 615.904 178.166C615.904 184.33 611.225 188.712 604.69 188.712C598.377 188.712 595.035 185.816 593.03 178.834L587.386 161.902H548.693L543.049 178.612C540.969 185.741 537.627 188.712 531.686 188.712ZM553.595 144.523H582.187L568.002 100.632H567.482L553.595 144.523Z" fill="black" />
                    </g>
                    <defs>
                        <clipPath id="clip0_249_18">
                            <rect width="653" height="195.079" fill="white" transform="translate(0 14.9214)" />
                        </clipPath>
                        <clipPath id="clip1_249_18">
                            <rect width="653" height="190.972" fill="white" transform="translate(0 0.54718)" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div className='flex flex-col gap-2'>
                {
                    requests.map((request, i) => (
                        <div key={i} className='relative'>
                            <button className='flex items-center gap-2 text-[12px]' onClick={() => updateActiveRequest(request)}>
                                <span className={`text-green-600 w-10 text-right`}>{request.method.toUpperCase()}</span> {request.name}
                            </button>
                            <button className='absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2' onClick={() => removeRequest(i)}>
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                }
                <button onClick={() => addRequest(REQUEST_DEFAULT_VALUES)}>New Request</button>
            </div>


        </div>
    )
}