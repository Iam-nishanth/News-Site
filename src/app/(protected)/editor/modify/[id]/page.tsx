import React from "react";
import { getDraft } from "@/utils/actions/draftActions";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import ModifyPost from "@/views/ModifyPost";

interface Props {
  params: { id: string };
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

const ModifyPostPage = async ({ params }: Props) => {
  const data = await getData(params.id);

  return (
    <MaxWidthWrapper className="relative py-5">
      {data && <ModifyPost post={data} />}
    </MaxWidthWrapper>
  );
};

export default ModifyPostPage;
