import SearchInput from "@/components/SearchInput";
import Posts from "@/components/SearchPosts";
import AdminWrapper from "@/components/admin-components/AdminWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { searchPosts } from "@/utils/actions/userActions";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  params: {};
  searchParams: { q: string; callback: string };
}

async function fetchPosts(query: string) {
  const response = await searchPosts(query);

  if (!response) return [];

  return response;
}

export default async function SearchPage({ searchParams }: Props) {
  // console.log(searchParams);
  try {
    const searchQuery = searchParams.q;
    const posts = await fetchPosts(searchQuery);

    return (
      <AdminWrapper>
        <div className="w-full flex justify-center items-center gap-2">
          <SearchInput value={searchQuery} show>
            <Link
              href="/"
              className={cn(
                "rounded-[50%]",
                buttonVariants({
                  variant: "outline",
                  size: "icon",
                  className: "rounded-[50%] px-2 sm:px-0",
                })
              )}
            >
              <span className="sr-only">Back to home</span>
              <X className="w-5 h-5" />
            </Link>
          </SearchInput>
        </div>

        {posts.length !== 0 ? (
          <p className=" text-center">
            Showing results for:{" "}
            <span className="font-semibold">{searchQuery}</span>
          </p>
        ) : (
          <p className=" text-center text-xl">
            No results available for query:{" "}
            <span className="font-semibold">{searchQuery}</span>
          </p>
        )}

        <Posts posts={posts} />
      </AdminWrapper>
    );
  } catch (error) {
    return (
      <>
        <SearchInput value={searchParams.q && searchParams.q} />
        <div className="flex flex-col justify-center items-center gap-3">
          <h1 className=" text-3xl font-semibold capitalize">Not Found</h1>
          <p>There are no posts yet with this query.</p>
        </div>
      </>
    );
  }
}
