import { ReactNode }      from "react";
import { MdError }        from "react-icons/md";
import { useFormContext } from "react-hook-form";

import { Label }        from "@/ui/label";
import { Input }        from "@/ui/input";
import { IconSelector } from "@/components/table/productDialog/IconSelector";

export default function ProductName({
  onSelectedIcon,
}: {
  onSelectedIcon: (selectedIcon: ReactNode) => void;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  function getSelectedIcon(selectedIcon: ReactNode) {
    onSelectedIcon(selectedIcon);
  }
  return (
    <div className="mt-5 flex flex-col gap-2">
      <Label htmlFor="product-name" className="text-slate-600">
        {`Nombre del producto`}
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          {...register("productName")}
          type="text"
          id="product-name"
          className="h-11 shadow-none"
          placeholder="Computadora..."
        />
        <IconSelector onUpdateIcon={getSelectedIcon} />
      </div>

      {errors.productName && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <MdError />
          <p>El nombre es obligatorio</p>
        </div>
      )}
    </div>
  );
}
