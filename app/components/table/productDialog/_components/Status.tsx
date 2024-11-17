"use client";

import { Dispatch, SetStateAction } from "react";

import { Label }                       from "@/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { FaCheck }                     from "react-icons/fa6";
import { IoClose }                     from "react-icons/io5";
import { FaInbox }                     from "react-icons/fa";
import { Product }                     from "@/components/products/Columns";

export default function Status({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<Product["status"]>>;
}) {
  return (
    <div>
      <Label className="text-slate-600">Estados</Label>
      <Tabs
        value={selectedTab}
        onValueChange={(value: string) =>
          setSelectedTab(value as Product["status"])
        }
        className="mt-1"
      >
        <TabsList className="h-11 px-2">
          <TabsTrigger
            className={`h-8 ${
              selectedTab === "Publicado" ? "text-red-500" : ""
            }`}
            value="Publicado"
          >
            <FaCheck className="pr-1" />
            Publicado
          </TabsTrigger>
          <TabsTrigger
            className={`h-8 ${
              selectedTab === "Inactivo" ? "text-red-500" : ""
            }`}
            value="Inactivo"
          >
            <IoClose />
            Inactivo
          </TabsTrigger>
          <TabsTrigger
            className={`h-8 ${selectedTab === "Borrador" ? "text-red-500" : ""}`}
            value="Borrador"
          >
            <FaInbox className="pr-1" />
            Borrador
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
