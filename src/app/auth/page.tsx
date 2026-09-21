import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import AuthForms from "@/components/sections/Auth/Forms";
import { siteConfig } from "@/config/site";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: `Welcome Back to ${siteConfig.name}`,
};

const AuthPageContent: NextPage = () => {
  return <AuthForms />;
};

const AuthPage: NextPage = () => {
  return (
    <Suspense>
      <NuqsAdapter>
      <AuthPageContent />
          </NuqsAdapter>
    </Suspense>
  );
};

export default AuthPage;
