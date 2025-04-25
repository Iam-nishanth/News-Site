"use client";
import { DraftPostsProvider } from "@/context/DraftContext";
import { StateProvider } from "@/context/State";
import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <StateProvider>{children}</StateProvider>
    </SessionProvider>
  );
};

export default AuthProvider;
