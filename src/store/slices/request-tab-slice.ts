import { createListenerMiddleware, createSlice, ListenerEffectAPI, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";

type TabsInitialStateType = {
    tabs: Array<{
        id: string,
        name: string,
    }>,
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
            state.activeTabId = action.payload.at(action.payload.length - 1)?.id || ''

            return state
        },
        addRequestTab: (state, action: PayloadAction<{ name: string, id: string }>) => {
            // the selected request is not on the tablist
            if (state.tabs.findIndex(t => t.id === action.payload.id) === -1) {
                state.tabs.push(action.payload)
            }
            state.activeTabId = action.payload.id

            return state;
        },

        removeRequestTab: (state, action: PayloadAction<string>) => {
            const filteredTabs = state.tabs.filter(t => t.id !== action.payload)
            state.tabs = filteredTabs

            // if the active tab is remove, reassign the last tab as the new active tab
            if (state.activeTabId === action.payload) {
                state.activeTabId = filteredTabs.at(filteredTabs.length - 1)?.id || ""
            }

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
    removeRequestTab
} = requestTabsSlice.actions