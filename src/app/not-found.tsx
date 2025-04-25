import Navbar from "@/components/Header/Navbar";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Navbar className="fixed top-0" />
      <MaxWidthWrapper className="grid h-screen place-content-center bg-background px-4">
        <div className="text-center space-y-3">
          <h1 className="text-9xl font-black text-gray-200 dark:text-gray-700">
            404
          </h1>

          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Uh-oh!
          </p>

          <p className="mt-4 text-gray-500 dark:text-gray-400">
            We can&apos;t find that page.
          </p>

          <Link
            className={buttonVariants({
              variant: "outline",
              className: "cursor-pointer",
            })}
            href="/"
          >
            Go Back Home
          </Link>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
