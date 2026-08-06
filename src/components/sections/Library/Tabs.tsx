"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import dynamic from "next/dynamic";

const LibraryList = dynamic(() => import("@/components/sections/Library/List"));
const ViewHistoryPage = dynamic(() => import("@/components/sections/Library/ViewHistory"));

export default function LibraryTabs() {
  const [activeTab, setActiveTab] = useState<string>("watchlist");

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Library</h1>
        <p className="text-foreground-500 mt-2">Manage your watchlist and view history</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary font-semibold",
        }}
      >
        <Tab
          key="watchlist"
          title="Watchlist"
          className="space-y-6"
        >
          <LibraryList />
        </Tab>

        <Tab
          key="history"
          title="View History"
          className="space-y-6"
        >
          <ViewHistoryPage />
        </Tab>
      </Tabs>
    </div>
  );
}