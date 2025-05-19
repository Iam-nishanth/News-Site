import { News } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface PostsProps {
    posts: Array<News>;
}

const Posts = ({ posts }: PostsProps) => {
    return (
        <div className="flex items-center flex-col w-full">
            {posts.map((post, index) => (
                <div key={index} className=" flex items-center p-1 sm:p-3 gap-4 my-3 rounded-xl border-[1px] border-zinc-600 w-full sm:w-3/4">
                    <div className="w-32 h-20 relative">
                        <Image src={post.featuredImg || ''} alt="avatar" fill />
                    </div>
                    <Link href={`/${post.categorySlug}/${post.id}`} className="w-full no-underline">
                        <div className="flex flex-col gap-2">
                            <h3 className=" text-lg sm:text-xl font-semibold">{post.title}</h3>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Posts;
