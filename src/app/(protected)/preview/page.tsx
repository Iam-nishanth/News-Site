import AdminWrapper from '@/components/admin-components/AdminWrapper';
import { buttonVariants } from '@/components/ui/button';
import { formatCreatedAt } from '@/lib/date';
import { getDrafts } from '@/utils/actions/draftActions';
import Link from 'next/link';

async function getData() {
    try {
        const draftPosts = await getDrafts();
        return draftPosts;
    } catch (error) {
        return null;
    }
}

export default async function Preview() {
    const draftPosts = await getData();

    const news = draftPosts || [];

    console.log(news);

    return (
        <AdminWrapper className="px-2 py-4">
            {draftPosts?.length !== 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {news.map((post, index) => {
                        return (
                            <div key={index} className=" w-full flex flex-col gap-5 justify-between p-4 border border-gray-700 dark:border-muted rounded-lg">
                                <h1>{post?.title}</h1>
                                <p className="w-full flex gap-3">
                                    Category: <span className="w-16 flex justify-center items-center bg-green-800 font-Roboto text-sm tracking-wide uppercase">{post?.categorySlug}</span>
                                </p>
                                <div>
                                    <p>
                                        Created: <span className=" text-blue-400">{post && formatCreatedAt(post.createdAt)}</span>
                                    </p>
                                    <p>
                                        Updated: <span className=" text-blue-400">{post && formatCreatedAt(post.updatedAt)}</span>
                                    </p>
                                </div>
                                <Link href={`/preview/${post?.id}`} className={buttonVariants({ variant: 'outline' })}>
                                    Open
                                </Link>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="w-full fixed-height flex flex-col justify-center items-center gap-3">
                    <h1 className="text-3xl font-semibold capitalize">Not Found</h1>
                    <p>There are no drafts present for now.</p>
                    <Link
                        href="/editor"
                        className={buttonVariants({
                            variant: 'default',
                            className: 'px-5'
                        })}
                    >
                        Write Posts
                    </Link>
                </div>
            )}
        </AdminWrapper>
    );
}
