'use client'

import { useAppDispatch, useAppSelector } from "@/store"
import { addRequestTab, removeRequestTab } from "@/store/actions"

function TabManager() {

    const { tabs } = useAppSelector(store => store.tabs)

    return (
        <div className="flex gap-4 px-4 mb-4">
            {tabs.map(tab => <RequestTab key={tab.id} {...{ ...tab }} />)}
        </div>
    )
}

function RequestTab(props: { id: string, name: string }) {

    const dispatch = useAppDispatch()
    const { activeTabId } = useAppSelector(store => store.tabs)

    return (
        <div className="flex min-w-[160px] items-center justify-between" onClick={() => dispatch(addRequestTab(props))}>
            <span>
                {props.id === activeTabId && "✅"} {" "}
                {props.name}
            </span>

            <button onClick={(e) => {
                e.stopPropagation()
                dispatch(removeRequestTab(props.id))
            }}>x</button>
        </div>
    )
}

export default TabManager