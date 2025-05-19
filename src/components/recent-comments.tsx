import { Button } from '@/components/ui/button';
import { CalendarIcon, ExternalLinkIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { getRecentComments } from '@/utils/actions/dashboardActions';
import { formatDistanceToNow } from 'date-fns';

export default async function RecentComments() {
    const comments = await getRecentComments();

    if (!comments || comments.length === 0) {
        return <div className="text-center py-4">No comments found</div>;
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">{comment.user.name}</span> on{' '}
                                <Link href={`/${comment.post.categorySlug}/${comment.post.slug}`} className="hover:underline">
                                    {comment.post.title}
                                </Link>
                            </p>
                            <p className="mt-1">{comment.desc}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </div>
                        </div>
                        <Link href={`/${comment.post.categorySlug}/${comment.post.slug}#comments`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLinkIcon className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
