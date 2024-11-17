"use client";

import * as React                from "react";
import { LuGitPullRequestDraft } from "react-icons/lu";

import { Button }    from "@/ui/button";
import { Checkbox }  from "@/ui/checkbox";
import { Separator } from "@/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover";

type Category = {
  value: string;
  label: string;
};

type CategoriesDropDownProps = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

const categories: Category[] = [
  { value: "Electronica", label: "Electronica" },
  { value: "Muebles", label: "Muebles" },
  { value: "Ropa", label: "Ropa" },
  { value: "Libros", label: "Libros" },
  { value: "Juguetes", label: "Juguetes" },
  { value: "Deportes", label: "Deportes" },
  { value: "Electrodomesticos", label: "Electrodomesticos" },
  { value: "Otros", label: "Otros" },
];

export function CategoriesDropDown({
  selectedCategories,
  setSelectedCategories,
}: CategoriesDropDownProps) {
  const [open, setOpen] = React.useState(false);

  function handleCheckboxChange(value: string) {
    setSelectedCategories((prev) => {
      const updatedCategories = prev.includes(value)
        ? prev.filter((category) => category !== value)
        : [...prev, value];

      return updatedCategories;
    });
  }

  function clearFilters() {
    setSelectedCategories([]);
  }

  return (
    <div className="flex items-center space-x-4 poppins">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={"secondary"} className="h-10">
            <LuGitPullRequestDraft />
            Categorías
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-56 poppins" side="bottom" align="end">
          <Command className="p-1">
            <CommandInput placeholder="Category" />
            <CommandList>
              <CommandEmpty className="text-slate-500 text-sm text-center p-5">
                No existe la categoría
              </CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem className="h-9" key={category.value}>
                    <Checkbox
                      checked={selectedCategories.includes(category.value)}
                      onClick={() => handleCheckboxChange(category.value)}
                      className="size-4 rounded-[4px]"
                    />
                    <div
                      className={`flex items-center gap-1 p-1 rounded-lg px-3  text-[14px]`}
                    >
                      {category.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="flex flex-col gap-2 text-[23px]">
              <Separator />
              <Button
                onClick={clearFilters}
                variant={"ghost"}
                className="text-[12px] mb-1"
              >
                Limpiar filtros
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
