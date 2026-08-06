"use client";

import { NextPage } from "next";
import dynamic from "next/dynamic";
import ProtectedLayout from "@/components/ProtectedLayout";

const ContinueWatching = dynamic(() => import("@/components/sections/Home/ContinueWatching"));
const HomePageList = dynamic(() => import("@/components/sections/Home/List"));

const MoviesPage: NextPage = () => {
  return (
    <ProtectedLayout>
      <div className="flex flex-col gap-3 md:gap-8">
        <ContinueWatching />
        <HomePageList />
      </div>
    </ProtectedLayout>
  );
};

export default MoviesPage;