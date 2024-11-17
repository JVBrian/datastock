"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Product } from "@/components/products/Columns";
import { Label }   from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

export function ProductCategory({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<Product["category"]>>;
}) {
  const categories = [
    "Electronica",
    "Muebles",
    "Ropa",
    "Libros",
    "Juguetes",
    "Deportes",
    "Electrodomesticos",
    "Otros",
  ];

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setSelectedCategory("Electronica");
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-2 poppins">
      <Label className="text-slate-600">{`Categoría del producto`}</Label>

      <Select
        value={selectedCategory}
        onValueChange={(value: string) =>
          setSelectedCategory(value as Product["category"])
        }
      >
        <SelectTrigger className="h-[45px] shadow-none">
          <SelectValue placeholder="Selecciona una categoríay" />
        </SelectTrigger>
        <SelectContent className="poppins">
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
