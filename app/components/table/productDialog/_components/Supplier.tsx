import { MdError }        from "react-icons/md";
import { useFormContext } from "react-hook-form";

import { Label } from "@/ui/label";
import { Input } from "@/ui/input";

export default function Supplier() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className=" flex flex-col gap-2">
      <Label htmlFor="supplier-name" className="text-slate-600">
        {`Nombre del proveedor`}
      </Label>
      <Input
        {...register("supplier")}
        type="text"
        id="supplier-name"
        className="h-11 shadow-none"
        placeholder="TechWorld..."
      />
      {errors.supplier && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <MdError />
          <p>
            <>{errors.supplier.message}</>
          </p>
        </div>
      )}
    </div>
  );
}
