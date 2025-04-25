import React from "react";
import dynamic from "next/dynamic";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { getAvalilableCategories } from "@/utils/actions/adminActions";

const EditorSection = dynamic(() => import("@/views/EditorSection"), {
  ssr: false,
});

export default async function EditorPage() {
  const categories = await getAvalilableCategories();

  return (
    <MaxWidthWrapper className="relative py-5">
      <EditorSection categories={categories ? categories : []} />
    </MaxWidthWrapper>
  );
}
