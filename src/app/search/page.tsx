import { NuqsAdapter } from "nuqs/adapters/next/app";
import { siteConfig } from "@/config/site";
import dynamic from "next/dynamic";
import { Metadata, NextPage } from "next/types";
import { Suspense } from "react";
const SearchList = dynamic(() => import("@/components/sections/Search/List"));

export const metadata: Metadata = {
  title: `Search Movies | ${siteConfig.name}`,
};

const SearchPage: NextPage = () => {
  return (
    <Suspense>
      <NuqsAdapter>
      <SearchList />
          </NuqsAdapter>
    </Suspense>
  );
};

export default SearchPage;
