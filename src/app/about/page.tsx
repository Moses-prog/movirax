import { siteConfig } from "@/config/site";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { NextPage } from "next";
import AboutClient from "@/components/sections/About/AboutClient";

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
};

const AboutPage: NextPage = () => {
  return <AboutClient />;
};

export default AboutPage;
