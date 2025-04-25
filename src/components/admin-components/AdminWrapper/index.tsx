import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const AdminWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("w-full max-w-[95%] px-3 mx-auto", className)}>
      {children}
    </div>
  );
};

export default AdminWrapper;
