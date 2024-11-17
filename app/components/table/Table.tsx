"use client";

import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ProductTable }                             from "../products/ProductTable";
import { columns }                                  from "../products/Columns";
import ProductDialog                                from "./productDialog/ProductDialog";
import { useProductStore }                          from "@/hooks/useProductStore";

export default function AppTable() {
  const { allProducts, loadProducts } = useProductStore();

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Card className="mt-12  flex flex-col shadow-none  poppins border-none ">
      <CardHeader className="flex justify-between">
        <div className="flex justify-between items-center">
          <div className="">
            <CardTitle className="font-bold text-[23px] ">Productos</CardTitle>
            <p className="text-sm text-slate-600">
              {allProducts.length} productos
            </p>
          </div>
          <ProductDialog />
        </div>
      </CardHeader>

      <CardContent>
        <ProductTable data={allProducts} columns={columns} />
      </CardContent>
    </Card>
  );
}
