"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ComponentType,
  useEffect,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { icons } from "./Icons";

export type SingleIcon = {
  id: number;
  icon: React.ReactNode;
  isSelected: boolean;
};

type IconContextType = {
  updateSelectedIcon: (icon: ReactNode) => void;
  openDialog: boolean;
  updateOpenDialog: (openDialog: boolean) => void;
  allIcons: SingleIcon[];
  setAllIcons: React.Dispatch<React.SetStateAction<SingleIcon[]>>;
  triggerIconSelection: (icon: string) => void;
};

const IconContext = createContext<IconContextType | undefined>(undefined);

export const IconProvider = ({
  children,
  iconsArray,
  onUpdateIcon,
}: {
  children: ReactNode;
  iconsArray: SingleIcon[];
  onUpdateIcon: (selectedIcon: ReactNode) => void;
}) => {
  const [openDialog, updateOpenDialog] = useState(false);
  const [allIcons, setAllIcons] = useState<SingleIcon[]>(iconsArray);

  const updateSelectedIcon = (icon: ReactNode) => {
    onUpdateIcon(icon);
  };

  const triggerIconSelection = (icon: string) => {
    try {
      const iconNode = convertStringToIcon(icon, allIcons);
      if (iconNode) {
        const updatedIcons = allIcons.map((singleIcon) => ({
          ...singleIcon,
          isSelected: singleIcon.icon === iconNode,
        }));
        setAllIcons(updatedIcons);
        updateSelectedIcon(iconNode);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <IconContext.Provider
      value={{
        updateSelectedIcon,
        openDialog,
        updateOpenDialog,
        allIcons,
        setAllIcons,
        triggerIconSelection,
      }}
    >
      {children}
    </IconContext.Provider>
  );
};

export const useIconContext = () => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error("useIconContext must be used within an IconProvider");
  }
  return context;
};

export function convertIconToString(icon: ReactNode): string | null {
  if (icon && (icon as React.ReactElement).type) {
    const iconType = (icon as React.ReactElement).type;
    if (typeof iconType === "function") {
      const iconName = (iconType as ComponentType).displayName || iconType.name;
      return iconName;
    }
  }
  return null;
}

export function convertStringToIcon(
  iconText: string,
  iconsArray: SingleIcon[]
): ReactNode {
  if (!iconText || !iconsArray) {
    throw new Error("Please set the icon text and the array of icons.");
  }
  for (const iconObj of iconsArray) {
    const iconType = (iconObj.icon as React.ReactElement).type;
    if (typeof iconType === "function") {
      const iconName = iconType.name;
      if (iconText === iconName) {
        return iconObj.icon;
      }
    }
  }
  throw new Error(`Icon with text "${iconText}" not found in the icon array.`);
}

export function IconDialogBox() {
  const {
    updateSelectedIcon,
    openDialog,
    updateOpenDialog,
    allIcons,
    setAllIcons,
  } = useIconContext();

  function updateSelection(singleIconProp: SingleIcon) {
    setAllIcons((prevArray) =>
      prevArray.map((singleIcon) => {
        if (singleIcon.id === singleIconProp.id) {
          updateSelectedIcon(singleIcon.icon);
          updateOpenDialog(!openDialog);
          return { ...singleIcon, isSelected: true };
        }
        return { ...singleIcon, isSelected: false };
      })
    );
  }

  if (!isAllIconsValid(allIcons)) {
    throw new Error("The allIcons array structure is invalid");
  }

  function isAllIconsValid(allIcons: unknown) {
    if (!Array.isArray(allIcons)) {
      throw Error("Please provide an array");
    }
    return allIcons.every(
      (icon) =>
        typeof icon.id === "number" &&
        typeof icon.isSelected === "boolean" &&
        React.isValidElement(icon.icon)
    );
  }

  return (
    <Dialog open={openDialog} onOpenChange={(open) => updateOpenDialog(open)}>
      <DialogTrigger asChild>
        <Button className="h-11">
          {allIcons.find((icon) => icon.isSelected)?.icon}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl mt-5">
        <DialogHeader>
          <DialogTitle>Selecciona un icono</DialogTitle>
          <DialogDescription>
            Elija un ícono para representar su contenido. Puedes actualizarlo en cualquier momento.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full border rounded-lg p-3 flex flex-wrap gap-2 mt-5">
          {allIcons.map((singleIcon, index) => (
            <div
              className={`rounded-md border p-3 hover:bg-primary hover:text-white ${
                singleIcon.isSelected
                  ? "bg-primary text-white border-none"
                  : "text-slate-400"
              }`}
              key={index}
              onClick={() => updateSelection(singleIcon)}
            >
              {singleIcon.icon}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function IconSelector({
  onUpdateIcon,
}: {
  onUpdateIcon: (selectedIcon: ReactNode) => void;
}) {
  function updatedIcon(selectedIcon: ReactNode) {
    onUpdateIcon(selectedIcon);
  }

  return (
    <IconProvider iconsArray={icons} onUpdateIcon={updatedIcon}>
      <ParentComponent />
    </IconProvider>
  );

  function ParentComponent({ iconToSelected }: { iconToSelected?: string }) {
    const { triggerIconSelection } = useIconContext();

    useEffect(() => {
      if (iconToSelected) {
        triggerIconSelection(iconToSelected);
      }
    }, [iconToSelected]);

    return <IconDialogBox />;
  }
}
