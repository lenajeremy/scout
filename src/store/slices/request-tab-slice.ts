import { createListenerMiddleware, createSlice, ListenerEffectAPI, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";

export type TabsInitialStateType = {
    tabs: string[],
    activeTabId: string,
}

const tabsInitialState: TabsInitialStateType = {
    tabs: [],
    activeTabId: ''
}

const requestTabsSlice = createSlice({
    name: 'requestTabsSlice',
    initialState: tabsInitialState,
    reducers: {
        bulkAddRequestTabs: (state, action: PayloadAction<TabsInitialStateType['tabs']>) => {
            state.tabs = action.payload
            state.activeTabId = action.payload.at(action.payload.length - 1) || ''

            return state
        },
        addRequestTab: (state, action: PayloadAction<string>) => {
            // the selected request is not on the tablist
            if (state.tabs.findIndex(t => t === action.payload) === -1) {
                state.tabs.push(action.payload)
            }
            state.activeTabId = action.payload

            return state;
        },

        removeRequestTab: (state, action: PayloadAction<string>) => {
            const filteredTabs = state.tabs.filter(t => t !== action.payload)
            state.tabs = filteredTabs

            // if the active tab is remove, reassign the last tab as the new active tab
            if (state.activeTabId === action.payload) {
                state.activeTabId = filteredTabs.at(filteredTabs.length - 1) || ""
            }

            return state
        },
        bulkRemoveRequestTabs: (state, action: PayloadAction<string[]>) => {
            let filteredTabs = state.tabs
            for (let requestId in action.payload) {
                filteredTabs = filteredTabs.filter(t => t !== requestId)
            }

            state.activeTabId = filteredTabs.at(filteredTabs.length - 1) || ""
            state.tabs = filteredTabs

            return state
        }

    }
})

export const requestTabMiddleware = createListenerMiddleware<RootState, AppDispatch>()

function updateLocalStorage(listenerApi: ListenerEffectAPI<RootState, AppDispatch>) {
    const requests = listenerApi.getState().tabs.tabs;
    localStorage.setItem("REQUEST_TABS", JSON.stringify(requests))
}

Object.values(requestTabsSlice.actions).forEach(action => requestTabMiddleware.startListening({
    actionCreator: action,
    effect: async (_, listenerApi) => updateLocalStorage(listenerApi)
}))


export default requestTabsSlice.reducer
export const {
    bulkAddRequestTabs,
    addRequestTab,
    removeRequestTab,
    bulkRemoveRequestTabs
} = requestTabsSlice.actions