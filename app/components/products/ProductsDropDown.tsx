import { Row }                            from "@tanstack/react-table";
import { nanoid }                         from "nanoid";
import { MoreHorizontal }                 from "lucide-react";
import { FaRegEdit }                      from "react-icons/fa";
import { MdContentCopy, MdOutlineDelete } from "react-icons/md";


import { Product }         from "@/components/products/Columns";
import { Button }          from "@/ui/button";
import { useProductStore } from "@/hooks/useProductStore";
import { useToast }        from "@/hooks/useToast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";


type MenuItem = {
  icon: JSX.Element;
  label: string;
  className: string;
  separator?: undefined;
};

export default function ProductDropDown({ row }: { row: Row<Product> }) {
  const {
    setSelectedProduct,
    setOpenDialog,
    setOpenProductDialog,
    addProduct,
  } = useProductStore();

  const { toast } = useToast();
  const menuItems: MenuItem[] = [
    { icon: <MdContentCopy />, label: "Copiar", className: "" },
    { icon: <FaRegEdit />, label: "Editar", className: "" },

    {
      icon: <MdOutlineDelete className="text-lg" />,
      label: "Eliminar",
      className: "text-red-600",
    },
  ];

  async function handleClickedItem(item: MenuItem) {
    if (item.label === "Eliminar") {
      setOpenDialog(true);
      setSelectedProduct(row.original);
    }

    if (item.label === "Copiar") {
      const productToCopy: Product = {
        ...row.original,
        id: nanoid(),
        name: `${row.original.name} (copy)`,
        createdAt: new Date(),
      };

      const result = await addProduct(productToCopy);

      if (result) {
        toast({
          title: "Producto copiado",
          description: "El producto se ha copiado satisfactoriamente",
        });
      }
    }

    if (item.label === "Editar") {
      setOpenProductDialog(true);
      setSelectedProduct(row.original);
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="poppins">
          {menuItems.map((item, index) =>
            item.separator ? (
              <DropdownMenuSeparator key={index} />
            ) : (
              <DropdownMenuItem
                key={index}
                className={`flex items-center gap-1 p-[10px] ${item.className}`}
                onClick={() => handleClickedItem(item)}
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
