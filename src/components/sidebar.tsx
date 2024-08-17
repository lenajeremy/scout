import * as React from "react";
import {
  BackpackIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { addRequestTab } from "@/store/actions";
import {
  buildSidebarStructure,
  createNewFolder,
  createNewRequest,
  deleteCollection,
  setActiveCollection,
  setActiveFolder,
  updateStoreFromCollection,
} from "@/lib/utils";
import { SidebarCollection, SidebarFolder } from "@/types/sidebar";
import { RequestWithSavedState } from "@/types/collection";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export function Sidebar() {
  const requests = useAppSelector((store) => store.requests);
  const { collections } = useAppSelector((store) => store.collections);
  const { folders } = useAppSelector((store) => store.folders);
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState(false);

  const repoStructure = React.useMemo(
    () => buildSidebarStructure(collections, folders, requests),
    [collections, folders, requests]
  );
  const { handleSubmit, register } = useForm<{
    collectionUrl: string;
    type: "postman" | "swagger";
  }>({
    defaultValues: {
      type: "postman",
      collectionUrl: "",
    },
  });

  const [loading, setLoading] = React.useState(false);

  const importPostmanCollectionFromURL: SubmitHandler<{
    collectionUrl: string;
  }> = React.useCallback(async (values) => {
    try {
      setLoading(true);
      const res = await fetch(values.collectionUrl);

      if (res.status === 200) {
        const collectionJSON = await res.json();
        updateStoreFromCollection(collectionJSON, dispatch);
        setOpenModal(false);

        toast.success("Postman collected imported successfully", {
          description: "You can proceed to make requests!",
        });
      } else {
        const error: {
          error: {
            name: string;
            message: string;
          };
        } = await res.json();

        toast.error("Unable to import Postman collection", {
          description: error.error.message,
        });
      }
    } catch (error) {
      toast.error("Unable to import Postman collection", {
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-4 pr-0 flex flex-col justify-between text-sm h-screen">
      <div className="sticky top-0">
        <svg
          width="75"
          height="28"
          viewBox="0 0 89 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="45.632"
            cy="18.762"
            rx="5"
            ry="6"
            fill="#0085FF"
            fillOpacity="0.3"
          />
          <ellipse cx="47.132" cy="19.712" rx="5.5" ry="6.05" fill="#0085FF" />
          <path
            className="fill-black dark:fill-white"
            d="M18.144 7.034L14.976 8.15C14.688 6.314 13.14 3.794 9.576 3.794C6.696 3.794 4.644 5.666 4.644 8.042C4.644 9.878 5.76 11.282 7.92 11.75L11.736 12.578C15.984 13.514 18.36 16.178 18.36 19.742C18.36 23.702 14.976 27.302 9.54 27.302C3.384 27.302 0.468 23.342 0 19.706L3.384 18.626C3.636 21.47 5.652 24.098 9.504 24.098C13.032 24.098 14.76 22.262 14.76 20.03C14.76 18.194 13.5 16.61 10.944 16.07L7.308 15.278C3.672 14.486 1.08 12.11 1.08 8.294C1.08 4.298 4.788 0.697998 9.504 0.697998C15.264 0.697998 17.568 4.262 18.144 7.034Z"
          />
          <path
            className="fill-black dark:fill-white"
            d="M27.6123 12.038C24.8763 12.038 22.3563 14.054 22.3563 18.086C22.3563 22.046 24.8403 24.17 27.6483 24.17C30.8883 24.17 32.0763 21.974 32.4723 20.606L35.4603 21.902C34.6323 24.386 32.1483 27.302 27.6483 27.302C22.6083 27.302 18.9003 23.342 18.9003 18.086C18.9003 12.686 22.6803 8.906 27.6123 8.906C32.2203 8.906 34.5963 11.786 35.3163 14.414L32.2563 15.71C31.8243 14.018 30.5643 12.038 27.6123 12.038Z"
          />
          <path
            className="fill-black dark:fill-white"
            d="M44.5103 24.278C47.3903 24.278 49.9103 22.118 49.9103 18.086C49.9103 14.09 47.3903 11.93 44.5103 11.93C41.6303 11.93 39.1103 14.09 39.1103 18.086C39.1103 22.118 41.6303 24.278 44.5103 24.278ZM44.5103 8.906C49.6943 8.906 53.3663 12.83 53.3663 18.086C53.3663 23.378 49.6943 27.302 44.5103 27.302C39.3263 27.302 35.6543 23.378 35.6543 18.086C35.6543 12.83 39.3263 8.906 44.5103 8.906Z"
          />
          <path
            className="fill-black dark:fill-white"
            d="M66.7721 24.674C65.8361 26.474 63.6761 27.302 61.6601 27.302C57.6281 27.302 55.1801 24.278 55.1801 20.354V9.446H58.5641V19.85C58.5641 22.226 59.6441 24.314 62.4881 24.314C65.2241 24.314 66.5921 22.514 66.5921 19.886V9.446H69.9761V23.558C69.9761 24.926 70.0841 26.15 70.1561 26.762H66.9161C66.8441 26.366 66.7721 25.394 66.7721 24.674Z"
          />
          <path
            className="fill-black dark:fill-white"
            d="M78.1268 3.974V9.446H81.8708V12.506H78.1268V21.506C78.1268 23.09 78.7747 23.882 80.5387 23.882C80.9708 23.882 81.5828 23.81 81.8708 23.738V26.618C81.5828 26.726 80.7188 26.942 79.5667 26.942C76.6147 26.942 74.7428 25.142 74.7428 22.01V12.506H71.4307V9.446H72.3668C74.2388 9.446 75.0308 8.294 75.0308 6.782V3.974H78.1268Z"
          />
          <path
            className="fill-black dark:fill-white"
            d="M83.8676 24.458C83.8676 23.054 84.9476 21.938 86.3516 21.938C87.7556 21.938 88.8716 23.054 88.8716 24.458C88.8716 25.862 87.7556 26.942 86.3516 26.942C84.9476 26.942 83.8676 25.862 83.8676 24.458Z"
            fill="#0085FF"
          />
        </svg>
      </div>

      <div className="flex flex-col overflow-scroll h-full mt-6 mb-6 gap-2 flex-1 pr-4">
        {repoStructure.map((c) => (
          <SidebarCollectionComponent key={c.id} {...{ ...c }} />
        ))}
      </div>

      <div className="flex flex-col gap-2 justify-end pr-4">
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button variant={"secondary"}>Import from Postman </Button>
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
                  type="url"
                  {...register("collectionUrl", { required: true })}
                />
              </div>
              <DialogFooter>
                <Button
                  loading={loading}
                  loadingText="Fetching collection from URL..."
                  type="submit"
                  className="w-full"
                >
                  Import
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          onClick={() =>
            toast.message("Importing from Swagger", {
              description: "t his is being imported",
            })
          }
        >
          Import from Swagger
        </Button>
      </div>
    </div>
  );
}

function SidebarCollectionComponent(props: SidebarCollection) {
  const dispatch = useAppDispatch();
  const { activeCollectionId } = useAppSelector((store) => store.collections);
  const [open, setOpen] = React.useState(true);
  const [deleteCollectionDialogOpen, setDeleteCollectionDialogOopen] =
    React.useState(false);

  return (
    <>
      <div>
        <div
          className={`py-1 px-2 rounded ${
            activeCollectionId === props.id ? "bg-accent" : ""
          } w-full text-left flex items-center justify-between`}
        >
          <button
            className="flex gap-3 items-center w-full rounded py-2"
            onClick={() => {
              setActiveCollection(dispatch, props.id);
              setOpen(!open);
            }}
          >
            <ChevronRightIcon
              className={`transform duration-300 ${
                open ? "rotate-90" : "rotate-0"
              }`}
            />
            {props.name}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size="icon" className="h-7 w-7">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 15 15"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => createNewFolder(dispatch, props.id, "")}
              >
                New Folder
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => createNewRequest(dispatch, props.id, "")}
              >
                New Request
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  variant={"destructive"}
                  className="w-full justify-start"
                  onClick={() => {
                    setTimeout(() => {
                      setDeleteCollectionDialogOopen(true);
                    }, 20);
                  }}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {open && (
          <div className={`flex flex-col pl-4 py-2 gap-2`}>
            {props.folders.map((folder) => (
              <SidebarFolderComponent key={folder.id} {...{ ...folder }} />
            ))}
            {props.requests.map((request) => (
              <SidebarRequestComponent key={request.id} {...{ ...request }} />
            ))}

            {props.folders.length == 0 && props.requests.length === 0 && (
              <div className="h-full p-4 space-y-2">
                <p className="text-sm text-center">Collection is empty.</p>
                <Button
                  onClick={() => createNewRequest(dispatch, props.id, "")}
                  className="mx-auto flex"
                  size={"sm"}
                >
                  Add Request
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog
        open={deleteCollectionDialogOpen}
        onOpenChange={setDeleteCollectionDialogOopen}
      >
        <DialogContent className="sm:max-w-[425px]" title="Delete Collection">
          <DialogHeader>
            <DialogTitle>Delete {props.name}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? You can&apos;t
              undo this action!
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={() => {
                deleteCollection(dispatch, props.id);
                setDeleteCollectionDialogOopen(false);
              }}
              className="w-full"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SidebarFolderComponent(folder: SidebarFolder) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <button
          className="flex gap-3 items-center"
          onClick={() => {
            setActiveFolder(dispatch, folder.id, folder.collectionId);
            setOpen(!open);
          }}
        >
          <ChevronRightIcon
            className={`transform duration-300 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          />
          <div className="flex gap-1 items-center">
            <BackpackIcon />
            <span>{folder.name}</span>
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size="icon" className="w-8 h-6">
              <svg
                width="16"
                height="16"
                viewBox="0 0 15 15"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                createNewFolder(dispatch, folder.collectionId, folder.id)
              }
            >
              New Folder
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                createNewRequest(dispatch, folder.collectionId, folder.id)
              }
            >
              New Request
            </DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {open && (
        <div className="ml-4 pt-1.5 gap-2">
          <div className="space-y-1.5">
            {folder.subFolders.map((folder) => (
              <SidebarFolderComponent key={folder.id} {...{ ...folder }} />
            ))}
          </div>
          {folder.requests.map((request) => (
            <SidebarRequestComponent key={request.id} {...{ ...request }} />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarRequestComponent(request: RequestWithSavedState) {
  const { activeTabId } = useAppSelector((store) => store.tabs);
  const dispatch = useAppDispatch();
  return (
    <div
      key={request.id}
      className={`relative my-2 after:absolute after:-left-2 after:h-full after:w-0.5 after:top-0 after:bg-transparent after:duration-200 ${
        request.id === activeTabId ? "after:bg-[#0085FF]" : "border-transparent"
      }`}
    >
      <button
        className="flex items-center gap-1 text-sm overflow-hidden whitespace-nowrap w-full text-left"
        onClick={() =>
          dispatch(addRequestTab(request.id))
        }
      >
        <p className="w-full text-ellipsis overflow-hidden">
          <span
            className={`text-[#0085FF] w-10 text-xs text-left mr-2 uppercase`}
          >
            {request.method}
          </span>
          <span>{request.name}</span>
          {!request.isUpdated && (
            <span className="w-6 h-6 rounded-full bg-yellow-700">saved</span>
          )}
        </p>
      </button>
    </div>
  );
}
