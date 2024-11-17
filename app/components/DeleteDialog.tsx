import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/alert-dialog";
import { useProductStore } from "@/hooks/useProductStore";
import { useToast }        from "@/hooks/useToast";

export function DeleteDialog() {
  const {
    openDialog,
    setOpenDialog,
    setSelectedProduct,
    selectedProduct,
    isLoading,
    deleteProduct,
  } = useProductStore();
  const { toast } = useToast();
  async function deleteProductFx() {
    if (selectedProduct) {
      const result = await deleteProduct(selectedProduct.id);
      if (result) {
        toast({
          title: "Producto Eliminado",
          description: `El producto [${selectedProduct.name}] ha sido eliminado exitosamente!`,
        });
      }
    }
  }

  return (
    <AlertDialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);
      }}
    >
      <AlertDialogContent className="p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
          ¿Estás absolutamente seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2">
          Esta acción no se puede deshacer. Esto eliminará permanentemente el
          producto.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8">
          <AlertDialogCancel
            onClick={() => {
              setSelectedProduct(null);
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteProductFx()}>
            {isLoading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
