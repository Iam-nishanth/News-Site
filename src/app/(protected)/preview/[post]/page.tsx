import React, { Suspense } from "react";
import "./styles.css";
import { getDraft } from "@/utils/actions/draftActions";
import DraftPreview from "@/components/admin-components/DraftPreview";
import AdminWrapper from "@/components/admin-components/AdminWrapper";
import prisma from "@/utils/connect";

interface Props {
  params: { post: string };
}

async function getData(id: string) {
  try {
    const draftPost = await getDraft(id);
    return draftPost;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const Previewpage = async ({ params }: Props) => {
  const data = await getData(params.post);

  const Post = data ? [data].filter(Boolean) : [];

  return (
    <AdminWrapper className=" max-w-screen-lg">
      <Suspense fallback={<div>Loading ...</div>}>
        <DraftPreview Post={Post} />
      </Suspense>
    </AdminWrapper>
  );
};

export default Previewpage;
