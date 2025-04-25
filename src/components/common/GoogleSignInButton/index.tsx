"use client";
import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface GoogleSignInButtonProps {
  children: ReactNode;
  className?: string;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({
  children,
  className,
}) => {
  const loginWithGoogle = () => {
    try {
      signIn("google");
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <Button
      onClick={loginWithGoogle}
      className={cn(
        "w-full flex items-center justify-center gap-2 uppercase font-semibold",
        className
      )}
      variant="outline"
    >
      <Image
        src="/images/google.svg"
        alt="google icon"
        width={20}
        height={20}
      />
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
