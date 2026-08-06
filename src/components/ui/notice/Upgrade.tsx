"use client";

import { Button, Link } from "@heroui/react";
import React from "react";
import { Icon } from "@iconify/react";

interface UpgradeNoticeProps {
  title: string;
  description: string;
}

const UpgradeNotice: React.FC<UpgradeNoticeProps> = ({ title, description }) => {
  return (
    <div className="flex h-[50dvh] flex-col items-center justify-center gap-4 text-center">
      <Icon icon="mdi:crown" width="48" className="text-primary mb-2" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-default-500 max-w-md">{description}</p>
      <div className="flex gap-2 mt-2">
        <Button color="primary" variant="flat" as={Link} href="/">
          Back to Home
        </Button>
        <Button color="primary" as={Link} href="/subscription">
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
};

export default UpgradeNotice;
