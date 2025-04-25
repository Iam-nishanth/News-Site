"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "@/components/SearchInput";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import MaxWidthWrapper from "../MaxWidthWrapper";

interface SearchInputProps {
  visible: boolean;
  onClose: () => void;
}

const SearchInputComp: React.FC<SearchInputProps> = ({ visible, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="search-input"
          className="fixed inset-x-0 inset-y-0 z-[60] backdrop-blur-lg py-4 flex "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          ref={ref}
        >
          <MaxWidthWrapper className="flex items-start w-full">
            <SearchInput show={visible}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-[50%] px-2 sm:px-0"
                onClick={onClose}
              >
                <span className="sr-only">Back to home</span>
                <X className="w-5 h-5" />
              </Button>
            </SearchInput>
          </MaxWidthWrapper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SearchButton: React.FC = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleCloseSearchInput = () => {
    setShowSearchInput(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowSearchInput((prev) => !prev)}
        variant="ghost"
        size="icon"
        className="relative"
      >
        <Search className="w-5 h-5" />
      </Button>
      <SearchInputComp
        visible={showSearchInput}
        onClose={handleCloseSearchInput}
      />
    </div>
  );
};

export default SearchButton;
