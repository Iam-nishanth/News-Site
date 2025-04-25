import React from "react";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { LogoutButton } from "@/components/common/AuthButtons";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  return (
    <MaxWidthWrapper className="flex flex-col min-h-96 justify-center items-center">
      <h1 className=" text-4xl">Admin Page</h1>
      {session && session.user ? (
        <>
          <LogoutButton />
          <p>Welcome {session.user.name}</p>
        </>
      ) : (
        <Button onClick={() => signIn()} type="button" variant="outline">
          Sign In
        </Button>
      )}
    </MaxWidthWrapper>
  );
}
