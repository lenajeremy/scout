"use client";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { addRequestTab, editRequest, removeRequestTab } from "@/store/actions";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { useFormContext } from "react-hook-form";
import { APIRequest } from "@/types/collection";

function TabManager() {
  const { tabs } = useAppSelector((store) => store.tabs);

  return (
    <div className="flex space-x-2 px-4 mb-4 py-2.5 border-b border-neutral-200 dark:border-neutral-700 overflow-x-scroll w-full">
      {tabs.map((tab) => (
        <RequestTab key={tab} id={tab} />
      ))}
    </div>
  );
}

function RequestTab(props: { id: string }) {
  const dispatch = useAppDispatch();
  const { activeTabId } = useAppSelector((store) => store.tabs);
  const requests = useAppSelector((store) => store.requests);
  const activeRequest = requests.find((r) => r.id == props.id)!;
  const isSaved = activeRequest.isUpdated || false;
  const [confirmTabClose, setConfirmTabClose] = React.useState(false);
  const formMethods = useFormContext<APIRequest>();

  const saveRequest = React.useCallback(() => {
    dispatch(
      editRequest({
        ...activeRequest,
        ...formMethods.getValues(),
        isUpdated: true,
      })
    );
  }, [activeRequest]);

  const clearRequestChanges = React.useCallback(() => {
    dispatch(editRequest({ ...activeRequest, isUpdated: true }));
  }, []);

  return (
    <>
      <Dialog open={confirmTabClose} onOpenChange={setConfirmTabClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  clearRequestChanges();
                  dispatch(removeRequestTab(props.id));
                }}
                variant={"destructive"}
              >
                Close Without Saving
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                saveRequest();
                dispatch(removeRequestTab(props.id));
              }}
            >
              Save & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <button
        className={`flex text-left gap-6 items-center justify-between px-3 py-1.5 duration-200 rounded-lg ${
          activeTabId === props.id
            ? "bg-secondary text-secondary-foreground border border-primary"
            : "bg-muted opacity-50"
        }`}
        onClick={() => dispatch(addRequestTab(props.id))}
      >
        <div className="flex gap-2 items-center">
          {!isSaved && (
            <span className="bg-yellow-600 h-2 w-2 rounded-full"></span>
          )}
          <span className="text-sm">{activeRequest.name}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isSaved) {
              setConfirmTabClose(true);
            } else {
              dispatch(removeRequestTab(props.id));
            }
          }}
        >
          <Cross2Icon />
        </button>
      </button>
      <div className="w-[1px] h-full bg-red-500" />
    </>
  );
}

export default TabManager;
