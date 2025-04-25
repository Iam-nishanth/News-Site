"use client";

import { Button } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
  return (
    <button style={{ marginRight: 10 }} onClick={() => signIn()}>
      Sign in
    </button>
  );
};

export const RegisterButton = () => {
  return (
    <Link href="/register" style={{ marginRight: 10 }}>
      Register
    </Link>
  );
};

export const LogoutButton = ({
  className,
  variant,
}: {
  className?: string;
  variant?: any;
}) => {
  return (
    <Button
      className={className}
      variant={variant}
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/auth/sign-in`,
        })
      }
    >
      Sign Out
    </Button>
  );
};

export const ProfileButton = () => {
  return <Link href="/profile">Profile</Link>;
};
