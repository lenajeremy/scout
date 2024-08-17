import * as React from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import TabManager from "./tab-manager";
import {
  APIRequest,
  RequestMethod,
  ResponseTypeEnum,
} from "@/types/collection";
import { getResponseData, prepareHeaders } from "@/lib/utils";
import { BodyFormData, RequestBodyEnum } from "@/types/form";
import { Select } from "./ui/select";
import { REQUEST_METHODS } from "@/constants";
import VariableInput from "./variable-input";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RequestParametersForm } from "./requestparametersform";
import { RequestBodyForm } from "./requestbodyform";
import { RequestHeadersForm } from "./requestheadersform";
import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/store";
import { useListenForSave as useListenForSaveKeyPress } from "@/hooks/useListenForSave";
import useWatchRequestUpdateState from "@/hooks/useWatchRequestUpdateState";
import { editRequest } from "@/store/actions";

type WithoutPromise<T> = T extends Promise<infer T> ? T : never;

const isFile = (
  d: BodyFormData[number]
): d is { key: string; value: FileList; type: "file" } => {
  return d.type === "file";
};

export default function RequestSection() {
  const formMethods = useFormContext<APIRequest>();
  const { resolvedTheme } = useTheme();

  const [responseData, setResponseData] = React.useState<
    WithoutPromise<ReturnType<typeof getResponseData>>
  >({ data: null, type: ResponseTypeEnum.json });

  const [status, setStatus] = React.useState<string>("");

  const [loading, setLoading] = React.useState<boolean>(false);

  const [url, setUrl] = React.useState(formMethods.getValues("url"));
  const activeRequestId = useAppSelector((store) => store.tabs.activeTabId);
  const activeRequest = useAppSelector((store) => store.requests).find(
    (r) => r.id === activeRequestId
  )!;
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (activeRequest) {
      setUrl(activeRequest.url);
    }
  }, [activeRequest]);

  // listens for the save key combination and runs the callback
  useListenForSaveKeyPress(() => {
    dispatch(
      editRequest({
        ...activeRequest,
        ...formMethods.getValues(),
        isUpdated: true,
      })
    );
  }, [activeRequest]);

  useWatchRequestUpdateState({
    callbackIfMatches() {
      dispatch(editRequest({ ...activeRequest, isUpdated: true }));
    },
    callbackIfNotMatches() {
      dispatch(editRequest({ ...activeRequest, isUpdated: false }));
    },
  });

  const makeRequest: SubmitHandler<APIRequest> = async (data) => {
    setLoading(true);

    const headers = prepareHeaders(data.headers);
    let res: Response | undefined = undefined;

    try {
      if (
        data.method === RequestMethod.GET ||
        data.method === RequestMethod.HEAD
      ) {
        res = await fetch(data.url, { method: data.method, headers });
      } else {
        switch (data.bodyType) {
          case RequestBodyEnum.json:
            res = await fetch(data.url, {
              method: data.method,
              body: data.jsonBody,
              headers,
            });
            break;

          case RequestBodyEnum.formData:
            const formData = new FormData();
            data.formData?.map((d) => {
              if (isFile(d)) {
                Array.from(d.value).forEach((file) =>
                  formData.append(d.key, file, file.name)
                );
              } else {
                formData.append(d.key, d.value as string);
              }
            });

            res = await fetch(data.url, {
              method: data.method,
              body: formData,
              headers,
            });
            break;

          case RequestBodyEnum.none:
            res = await fetch(data.url, { method: data.method, headers });
            break;
        }
      }

      if (res) {
        const requestData = await getResponseData<any>(res);
        setResponseData(requestData);
        setStatus(`${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onUrlInput = React.useCallback(
    (url: string) => formMethods.setValue("url", url),
    []
  );

  return (
    <main className="overflow-hidden">
      <TabManager />
      <form onSubmit={formMethods.handleSubmit(makeRequest)} className="h-full">
        <div className="flex items-center gap-2 px-4">
          <Select
            options={
              REQUEST_METHODS as unknown as Array<{
                label: string;
                value: string;
              }>
            }
            onChange={(option) => {
              formMethods.setValue("method", option.value as RequestMethod);
            }}
            placeholder="Request Method"
            searchPlaceholder="Search request method"
            defaultValue={formMethods.getValues("method").toUpperCase()}
          />

          <VariableInput intialValue={url} onChange={onUrlInput} />

          <Input
            type="text"
            placeholder="Enter request name"
            className="outline-none w-60"
            autoFocus
            {...formMethods.register("name", { required: true })}
          />
          <Button loading={loading} disabled={loading} type="submit">
            Send
          </Button>
        </div>

        <div className="h-[1px] w-full bg-muted my-4" />

        <div>
          <Tabs defaultValue="params">
            <TabsList className="mx-4 w-[calc(100%-32px)]">
              <TabsTrigger className="flex-1" value="params">
                Params
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="body">
                Body
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="headers">
                Headers
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="auth">
                Auth
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="settings">
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="h-96 overflow-scroll">
              <TabsContent value="params" className="h-full px-4 m-0">
                <RequestParametersForm />
              </TabsContent>
              <TabsContent value="body" className="h-full m-0">
                <RequestBodyForm />
              </TabsContent>
              <TabsContent value="headers" className="h-full px-4">
                <RequestHeadersForm />
              </TabsContent>
              <TabsContent value="auth" className="h-full px-4">
                <h1 className="text-5xl">Auth</h1>
              </TabsContent>
              <TabsContent value="settings" className="h-full px-4">
                <h1 className="text-5xl">Settings</h1>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="h-[1px] w-full bg-muted my-4" />

        <div className="relative h-96">
          <code className="text-[12px] text-right top-0 right-5 opacity-60 w-full block absolute z-50">
            {status}
          </code>
          {responseData.type === ResponseTypeEnum.json && (
            <MonacoEditor
              className="h-full"
              defaultLanguage="json"
              theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
              value={JSON.stringify(responseData.data, null, 3)}
              options={{
                minimap: { enabled: false },
                readOnly: true,
                wordWrap: "on",
              }}
            />
          )}

          {responseData.type === ResponseTypeEnum.audio && (
            <audio controls src={responseData.data as string} />
          )}

          {responseData.type === ResponseTypeEnum.html && (
            <iframe
              className="w-full h-96"
              srcDoc={responseData.data as string}
            />
          )}

          {responseData.type === ResponseTypeEnum.text && (
            <p>{responseData.data as string}...</p>
          )}

          {responseData.type === ResponseTypeEnum.video && (
            <video
              controls
              src={responseData.data as string}
              className="w-full h-full"
            />
          )}

          {responseData.type === ResponseTypeEnum.image && (
            <img
              src={responseData.data as string}
              className="w-full h-full object-contain"
              alt="response image"
              width={500}
              height={500}
            />
          )}
        </div>
      </form>
    </main>
  );
}
