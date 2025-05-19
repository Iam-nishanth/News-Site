import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Edit2Icon, EyeIcon, TrashIcon, MessageSquareIcon } from 'lucide-react';
import Link from 'next/link';
import { getRecentArticles } from '@/utils/actions/dashboardActions';
import { formatDistanceToNow } from 'date-fns';

export default async function RecentArticles() {
    const articles = await getRecentArticles();

    if (!articles || articles.length === 0) {
        return <div className="text-center py-4">No articles found</div>;
    }

    return (
        <div className="space-y-4">
            {articles.map((article) => (
                <div key={article.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-medium">{article.title}</h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                                <span className="mx-2">•</span>
                                <MessageSquareIcon className="h-3 w-3 mr-1" />
                                {article.comments.length}
                                <span className="mx-2">•</span>
                                {article.cat?.title || 'Uncategorized'}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link href={`/admin/edit-news/${article.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit2Icon className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            ))}
            <div className="flex justify-end">
                <Link href="/admin/manage-news">
                    <Button variant="outline" size="sm">
                        View All Articles
                    </Button>
                </Link>
            </div>
        </div>
    );
}
