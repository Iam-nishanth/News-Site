import React, { useState, createContext, ReactNode, useContext } from "react";

// Define the context value type
interface StateContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Create the context with a default value
export const StateContext = createContext<StateContextValue | undefined>(
  undefined
);

// Define the provider component
export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);

  // Provide the open state and the setOpen function to the context
  return (
    <StateContext.Provider value={{ open, setOpen }}>
      {children}
    </StateContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }

  return context;
};
