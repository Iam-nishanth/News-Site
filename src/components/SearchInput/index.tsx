"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Button } from "../ui/button";

const SearchInput = ({
  value,
  children,
  show,
}: {
  value?: string;
  children?: React.ReactNode;
  show?: boolean;
}) => {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : ""
  );
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show) inputRef.current?.focus();
  }, [show]);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string") {
      return;
    }
    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?q=${encodedSearchQuery}`);
  };

  return (
    <form
      onSubmit={onSearch}
      className="flex justify-center w-full sm:w-2/3 mx-auto py-3 items-center gap-3"
    >
      <div className="w-full flex-1 h-full flex items-center relative">
        <Input
          ref={inputRef}
          value={searchQuery || ""}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="relative w-full px-5 py-3 text-foreground dark:text-zinc-200 bg-background focus:bg-background dark:focus:bg-black  rounded-full focus:outline-none focus:ring-[1px] focus:ring-green-700 placeholder:text-zinc-400"
          placeholder="What are you looking for?"
        />
        <Button
          type="submit"
          variant="ghost"
          className="absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer hover:bg-transparent px-0"
        >
          <span className="sr-only">Search</span>
          <Search className="w-5 h-5" onClick={onSearch} />
        </Button>
      </div>
      <div>{children}</div>
    </form>
  );
};

export default SearchInput;
