'use client';
import { Button } from '@/components/ui/button';
import { DeleteDraft, PublishDraft } from '@/utils/actions/draftActions';
import { DraftPost } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const DraftPreview = ({ Post }: { Post: DraftPost[] }) => {
    const router = useRouter();

    const handlePublish = async () => {
        try {
            const response = await PublishDraft(Post[0]);
            if (response == 'Insufficient details') {
                toast.error('Insufficient details');
            } else if (response == 'Server Error') {
                toast.error('Something went wrong');
            } else if (response == 'Successful') {
                toast.success('Published Draft');
                router.push('/preview');
                router.refresh();
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await DeleteDraft(Post[0].id);
            if (response == 'Insufficient details') {
                toast.error('Insufficient details');
            } else if (response == 'Server Error') {
                toast.error('Something went wrong');
            } else if (response == 'Successful') {
                toast.success('Deleted Draft');
                router.push('/preview');
                router.refresh();
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleEdit = async (id: string) => {
        router.push(`/editor/modify/${id}`);
    };

    return Post?.map((item, index) => (
        <div key={index}>
            <div className="w-full flex justify-end gap-4 py-4 px-5">
                <Button type="button" variant="default" onClick={handlePublish} className="uppercase font-semibold tracking-wider">
                    Publish
                </Button>
                <Button onClick={() => handleEdit(item.id)}>Edit</Button>
                <Button type="button" variant="destructive" onClick={handleDelete} className="uppercase font-semibold tracking-wider">
                    Delete
                </Button>
            </div>

            {/* ---------------------------------------Preview------------------------------------ */}

            <div key={index} className=" space-y-3 p-1 lg:p-3 ">
                <h1 className="text-2xl md:text-3xl font-semibold text-center">{item?.title}</h1>
                <div className="flex flex-col gap-2">
                    {item?.featuredImg && (
                        <div className="relative w-full min-h-[250px] lg:min-h-[500px]">
                            <Image src={item.featuredImg} alt={item.title} fill className="lg:object-contain object-cover" />
                        </div>
                    )}
                    <p className="text-center text-xs md:text-sm">{item?.imgCaption}</p>
                </div>
                <div className="px-0 md:px-3 py-2">
                    <div className="content tracking-normal md:tracking-wide font-normal text-base lg:text-lg !font-Roboto" dangerouslySetInnerHTML={{ __html: item?.content ?? '' }}></div>
                </div>
            </div>

            {/* -------------------------------------------------------------------------------------------- */}

            <div className="w-full flex justify-center gap-4 py-4 px-5">
                <Button type="button" variant="default" onClick={handlePublish} className="uppercase font-semibold tracking-wider">
                    Publish
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete} className="uppercase font-semibold tracking-wider">
                    Delete
                </Button>
            </div>
        </div>
    ));
};

export default DraftPreview;
