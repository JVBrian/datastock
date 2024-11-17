"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { z }                                      from "zod";
import { useForm, FormProvider }                  from "react-hook-form";
import { zodResolver }                            from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";

import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/ui/dialog";
import { Separator }       from "@/ui/separator";
import ProductName         from "@/components/table/productDialog/_components/ProductName";
import Price               from "@/components/table/productDialog/_components/Price";
import { ProductCategory } from "@/components/table/productDialog/_components/ProductCategory";
import Quantity            from "@/components/table/productDialog/_components/Quantity";
import SKU                 from "@/components/table/productDialog/_components/SKU";
import Status              from "@/components/table/productDialog/_components/Status";
import Supplier            from "@/components/table/productDialog/_components/Supplier";
import { Product }         from "@/components/products/Columns";
import { icons }           from "@/components/table/productDialog/Icons";
import { useProductStore } from "@/hooks/useProductStore";
import { useToast }        from "@/hooks/useToast";

const ProductSchema = z.object({
  productName: z
    .string()
    .min(1, "El nombre del producto es obligatorio")
    .max(100, "El nombre del producto debe tener 100 caracteres o menos"),
  sku: z
    .string()
    .min(1, "El SKU es obligatorio")
    .regex(/^[a-zA-Z0-9-_]+$/, "El SKU debe ser alfanumérico"),
  supplier: z
    .string()
    .min(1, "El proveedor es obligatorio")
    .max(100, "El nombre del proveedor debe tener 100 caracteres o menos"),

  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .nonnegative("La cantidad no puede ser negativa"),
  price: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "", {
      message: "El precio es obligatorio",
    })
    .transform((val) => {
      if (val === "") return undefined;
      const num = Number(val);
      return Number(num.toFixed(2));
    })
    .pipe(
      z
        .number({
          required_error: "El precio es obligatorio",
          invalid_type_error: "El precio debe ser un número",
        })
        .nonnegative("El precio no puede ser negativo")
    ),
});

// Define TypeScript type for the form data
type ProductFormData = z.infer<typeof ProductSchema>;

export default function ProductDialog() {
  const methods = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      productName: "",
      sku: "",
      supplier: "",
      quantity: 0,
      price: 0.0,
    },
  });

  const { reset } = methods;

  const [selectedTab, setSelectedTab] =
    useState<Product["status"]>("Publicado");

  const [selectedCategory, setSelectedCategory] =
    useState<Product["category"]>("Electronica");
  const [selectedIcon, setSelectedIcon] = useState<null | ReactNode>(
    icons.find((icon) => icon.isSelected === true)?.icon
  );

  const {
    addProduct,
    isLoading,
    openProductDialog,
    setOpenProductDialog,
    setSelectedProduct,
    selectedProduct,
    updateProduct,
  } = useProductStore();
  const { toast } = useToast();
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      reset({
        productName: selectedProduct.name,
        sku: selectedProduct.sku,
        supplier: selectedProduct.supplier,
        quantity: selectedProduct.quantityInStock,
        price: selectedProduct.price,
      });
      setSelectedTab(selectedProduct.status);
      setSelectedCategory(selectedProduct.category);
      setSelectedIcon(selectedProduct.icon);
    } else {
      reset({
        productName: "",
        sku: "",
        supplier: "",
        quantity: 0,
        price: 0.0,
      });

      setSelectedTab("Publicado");
      setSelectedCategory("Electronica");
    }
  }, [selectedProduct, openProductDialog]);

  const onSubmit = async (data: ProductFormData) => {
    if (!selectedProduct) {
      const newProduct: Product = {
        id: nanoid(),
        supplier: data.supplier,
        name: data.productName,
        price: data.price,
        quantityInStock: data.quantity,
        sku: data.sku,
        status: selectedTab,
        category: selectedCategory,
        icon: selectedIcon,
        createdAt: new Date(),
      };

      const result = await addProduct(newProduct);

      if (result) {
        toast({
          title: "Éxito",
          description: "¡Producto agregado con éxito!",
        });
        dialogCloseRef.current?.click();
      }
    } else {
      const productToUpdate: Product = {
        id: selectedProduct.id,
        createdAt: selectedProduct.createdAt,
        supplier: data.supplier,
        name: data.productName,
        price: data.price,
        quantityInStock: data.quantity,
        sku: data.sku,
        status: selectedTab,
        category: selectedCategory,
        icon: selectedIcon,
      };

      const result = await updateProduct(productToUpdate);
      if (result.success) {
        toast({
          title: "Éxito",
          description: "¡Producto actualizado con éxito!",
        });
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al actualizar el producto.",
        });
      }
    }
  };

  function handleReset() {
    reset();
    setSelectedProduct(null);
  }

  function onSelectedIcon(icon: ReactNode) {
    setTimeout(() => {
      setSelectedIcon(icon);
    }, 0);
  }

  return (
    <Dialog open={openProductDialog} onOpenChange={setOpenProductDialog}>
      <DialogTrigger asChild>
        <Button className="h-10">Agregar producto</Button>
      </DialogTrigger>
      <DialogContent className="p-7 px-8 poppins">
        <DialogHeader>
          <DialogTitle className="text-[22px] ">
            {selectedProduct ? "Editar producto" : "Agregar producto"}
          </DialogTitle>
          <DialogDescription>
            Completa el formulario para agregar un nuevo producto
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2 mt-1">
              <div className="grid grid-cols-2 gap-7">
                <ProductName onSelectedIcon={onSelectedIcon} />
                <SKU />
              </div>

              <div className="grid grid-cols-2 gap-5 items-start mt-4">
                <Supplier />
                <ProductCategory
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
              <div className="mt-3 flex justify-between gap-7 max-lg:grid-cols-2 max-lg:gap-1 max-sm:grid-cols-1">
                <Status
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
                <Quantity />
                <Price />
              </div>
            </div>
            <DialogFooter className="mt-9 mb-4 flex items-center gap-4 ">
              <DialogClose
                ref={dialogCloseRef}
                onClick={() => {
                  handleReset();
                }}
                asChild
              >
                <Button variant={"secondary"} className="h-11 px-11 ">
                  Cancelar
                </Button>
              </DialogClose>

              <Button className="h-11 px-11">
                {isLoading
                  ? "Cargando..."
                  : `${selectedProduct ? "Editar producto" : "Agregar producto"}`}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
