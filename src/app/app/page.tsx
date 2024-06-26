"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { REQUEST_DEFAULT_VALUES } from "@/constants";
import { FormProvider, useForm } from "react-hook-form";
import { APIRequest, Request } from "@/types/collection";
import {
  createNewCollection,
  createNewFolder,
  createNewRequest,
} from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { ModeToggle } from "@/components/ui/theme-switcher";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { bulkAddRequests } from "@/store/actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import RequestSection from "@/components/request-section";

export default function Home() {
  const formMethods = useForm<APIRequest>({
    defaultValues: REQUEST_DEFAULT_VALUES,
  });

  const { activeTabId } = useAppSelector((store) => store.tabs);
  const { activeCollectionId } = useAppSelector((store) => store.collections);
  const { activeFolderId } = useAppSelector((store) => store.folders);

  const requests = useAppSelector((store) => store.requests);
  const activeRequest = React.useMemo(
    () => requests.find((r) => r.id === activeTabId),
    [requests, activeTabId]
  );

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const localStoredRequests: Array<Request> = JSON.parse(
      localStorage.getItem("requests") || "[]"
    );
    dispatch(bulkAddRequests(localStoredRequests));
  }, []);

  React.useEffect(() => {
    if (!activeRequest) return;

    console.log(activeRequest);

    for (let [key, value] of Object.entries(activeRequest)) {
      // @ts-ignore
      formMethods.setValue(key, value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRequest]);

  return (
    <FormProvider {...formMethods}>
      <div className="grid grid-cols-[300px,_1px,_1fr,_1px,_64px] max-h-screen overflow-clip mx-auto">
        <Sidebar />
        <div className="h-full w-full bg-neutral-200 dark:bg-neutral-700" />
        {activeRequest ? (
          <RequestSection />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p>Create a request to get started</p>
          </div>
        )}

        <div className="h-full w-full bg-neutral-200 dark:bg-neutral-700" />

        <div className="mt-4 flex flex-col gap-2 ml-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <PlusCircledIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => createNewCollection(dispatch)}>
                New Collection
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  createNewFolder(dispatch, activeCollectionId, activeFolderId)
                }
              >
                Mew Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  createNewRequest(dispatch, activeCollectionId, activeFolderId)
                }
              >
                New Request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </FormProvider>
  );
}
