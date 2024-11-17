"use client";

import React, { useEffect, useState } from "react";
import { useTheme }                   from "next-themes";

import AppHeader        from "@/components/header/Header";
import { Card }         from "@/ui/card";
import AppTable         from "@/components/table/Table";
import { DeleteDialog } from "@/components/DeleteDialog";

export default function Home() {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const bgColor = theme === "dark" ? "bg-black" : "bg-gray-50";

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className={`poppins p-5 ${bgColor} border w-full min-h-screen max-sm:p-1`}>
      <Card className="flex flex-col shadow-none p-5">
        <DeleteDialog />
        <AppHeader />
        <AppTable />
      </Card>
    </div>
  );
}
