"use client";

import * as Toast from "@radix-ui/react-toast";
import { useState, createContext, useContext, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react"; // Optional: icons

type ToastType = "success" | "error" | "info";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");

  const showToast = useCallback((msg: string, t: ToastType = "info") => {
    setOpen(false); // close any current toast before showing new
    setTimeout(() => {
      setMessage(msg);
      setType(t);
      setOpen(true);
    }, 100);
  }, []);

  const getTypeStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-white mr-2" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-white mr-2" />;
      default:
        return <Info className="w-5 h-5 text-white mr-2" />;
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <ToastContext.Provider value={{ showToast }}>
        {children}
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`fixed top-6  right-6 z-50 flex items-center gap-2 rounded-md px-5 py-3 shadow-xl transition-transform animate-slide-in ${getTypeStyle()}`}
        >
          {getIcon()}
          <Toast.Title className="font-medium">{message}</Toast.Title>
          <Toast.Close className="ml-auto text-white text-lg hover:text-gray-200 transition-colors">
            ✕
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport className="fixed top-6 right-6 z-50" />
      </ToastContext.Provider>
    </Toast.Provider>
  );
}
