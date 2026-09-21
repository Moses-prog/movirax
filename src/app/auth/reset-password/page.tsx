import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import AuthForms from "@/components/sections/Auth/Forms";
import { NextPage } from "next";
import React from "react";

const AuthResetPasswordPage: NextPage = () => {
  return (
    <Suspense>
      <NuqsAdapter>
        <AuthForms />
      </NuqsAdapter>
    </Suspense>
  );
};

export default AuthResetPasswordPage;
