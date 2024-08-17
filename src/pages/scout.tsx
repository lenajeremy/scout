import * as React from "react";
import { Button } from "@/components/ui/button";
import { REQUEST_DEFAULT_VALUES } from "@/constants";
import { FormProvider, useForm } from "react-hook-form";
import {
  APIRequest,
  Collection,
  Folder,
  RequestWithSavedState,
} from "@/types/collection";
import {
  createNewCollection,
  createNewFolder,
  createNewRequest,
} from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { ModeToggle } from "@/components/ui/theme-switcher";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  bulkAddRequests,
  bulkAddCollections,
  bulkAddRequestTabs,
  bulkAddFolders,
} from "@/store/actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import RequestSection from "@/components/request-section";

export default function Scout() {
  const formMethods = useForm<APIRequest>({
    defaultValues: REQUEST_DEFAULT_VALUES,
  });

  const { activeTabId } = useAppSelector((store) => store.tabs);
  const { activeCollectionId } = useAppSelector((store) => store.collections);
  const { activeFolderId } = useAppSelector((store) => store.folders);
  const requests = useAppSelector((store) => store.requests);
  const activeRequest = requests.find((r) => r.id === activeTabId);

  const dispatch = useAppDispatch();
  const hasLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (!hasLoadedRef.current) {
      const localRequests: RequestWithSavedState[] = JSON.parse(
        localStorage.getItem("REQUESTS") || "[]"
      );
      const localCollections: Collection[] = JSON.parse(
        localStorage.getItem("COLLECTIONS") || "[]"
      );
      const localFolders: Folder[] = JSON.parse(
        localStorage.getItem("FOLDERS") || "[]"
      );
      const localRequestTabs: string[] = JSON.parse(
        localStorage.getItem("REQUEST_TABS") || "[]"
      );

      dispatch(bulkAddRequests(localRequests));
      dispatch(bulkAddCollections(localCollections));
      dispatch(bulkAddRequestTabs(localRequestTabs));
      dispatch(bulkAddFolders(localFolders));

      hasLoadedRef.current = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!activeRequest) {
      formMethods.setValue("name", REQUEST_DEFAULT_VALUES.name);
      formMethods.setValue("url", REQUEST_DEFAULT_VALUES.url);
      formMethods.setValue("method", REQUEST_DEFAULT_VALUES.method);
      formMethods.setValue("params", REQUEST_DEFAULT_VALUES.params);
      formMethods.setValue("formData", REQUEST_DEFAULT_VALUES.formData);
      formMethods.setValue("bodyType", REQUEST_DEFAULT_VALUES.bodyType);
      formMethods.setValue("jsonBody", REQUEST_DEFAULT_VALUES.jsonBody);
      formMethods.setValue("headers", REQUEST_DEFAULT_VALUES.headers);
      formMethods.setValue("response", REQUEST_DEFAULT_VALUES.response);
      return;
    }

    formMethods.setValue("name", activeRequest.name);
    formMethods.setValue("url", activeRequest.url);
    formMethods.setValue("method", activeRequest.method);
    formMethods.setValue("params", activeRequest.params);
    formMethods.setValue("formData", activeRequest.formData);
    formMethods.setValue("bodyType", activeRequest.bodyType);
    formMethods.setValue("jsonBody", activeRequest.jsonBody);
    formMethods.setValue("headers", activeRequest.headers);
    formMethods.setValue("response", activeRequest.response);
  }, [activeTabId]);

  return (
    <FormProvider {...formMethods}>
      <div className="grid grid-cols-[300px,_1px,_1fr,_1px,_64px] max-h-screen overflow-clip mx-auto">
        <Sidebar />
        <div className="h-full w-full bg-border" />
        {activeRequest ? (
          <RequestSection />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p>Create a request to get started</p>
          </div>
        )}

        <div className="h-full w-full bg-border" />

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
