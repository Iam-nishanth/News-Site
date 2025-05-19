'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Edit2Icon, EyeIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserArticles } from '@/utils/actions/userActions';
import { deleteNews } from '@/utils/actions/adminActions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Article {
    id: string;
    title: string;
    slug: string;
    categorySlug: string;
    createdAt: Date;
    tags: string[];
    cat: {
        title: string;
    } | null;
}

export default function UserArticles({ userEmail }: { userEmail: string }) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchArticles = async () => {
            const data = await getUserArticles(userEmail);
            if (data) {
                setArticles(
                    data.map((article) => ({
                        ...article,
                        categorySlug: article.categorySlug || '' // Convert null to empty string
                    }))
                );
            }
            setIsLoading(false);
        };

        fetchArticles();
    }, [userEmail]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            const response = await deleteNews(id);
            if (response.status === 'success') {
                toast.success('Article deleted successfully');
                setArticles(articles.filter((article) => article.id !== id));
                router.refresh();
            } else {
                toast.error('Failed to delete article');
            }
        }
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading articles...</div>;
    }

    if (articles.length === 0) {
        return <div className="text-center py-4">No articles found</div>;
    }

    return (
        <div className="space-y-4">
            {articles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{article.title}</h3>
                        <div className="flex space-x-2">
                            <Link href={`/admin/edit-news/${article.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit2Icon className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(article.id)}>
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                        <span className="mx-2">•</span>
                        {article.cat?.title || article.categorySlug || 'Uncategorized'}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <Link href={`/${article.categorySlug}/${article.slug}`}>
                            <Button variant="outline" size="sm">
                                View Article
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
