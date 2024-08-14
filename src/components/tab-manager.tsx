"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { addRequestTab, removeRequestTab } from "@/store/actions";
import { Cross2Icon } from "@radix-ui/react-icons";

function TabManager() {
  const { tabs } = useAppSelector((store) => store.tabs);

  return (
    <div className="flex space-x-2 px-4 mb-4 py-2.5 border-b border-neutral-200 dark:border-neutral-700 overflow-x-scroll w-full">
      {tabs.map((tab) => (
        <RequestTab key={tab.id} {...{ ...tab }} />
      ))}
    </div>
  );
}

function RequestTab(props: { id: string; name: string }) {
  const dispatch = useAppDispatch();
  const { activeTabId } = useAppSelector((store) => store.tabs);

  return (
    <>
      <button
        className={`flex text-left gap-6 items-center justify-between px-3 py-1.5 duration-200 rounded-lg ${
          activeTabId === props.id
            ? "bg-secondary text-secondary-foreground border border-primary"
            : "bg-muted opacity-50"
        }`}
        onClick={() => dispatch(addRequestTab(props))}
      >
        <span className="text-sm">{props.name}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(removeRequestTab(props.id));
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
