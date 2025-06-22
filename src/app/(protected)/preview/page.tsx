import AdminWrapper from '@/components/admin-components/AdminWrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatCreatedAt } from '@/lib/date';
import { getDrafts } from '@/utils/actions/draftActions';
import { Calendar, Edit3, FileText, Plus } from 'lucide-react';
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

    return (
        <AdminWrapper className="px-6 py-8">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Draft Posts</h1>
                        <p className="text-muted-foreground mt-2">Manage and preview your draft articles before publishing</p>
                    </div>
                    <Link href="/editor">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Draft
                        </Button>
                    </Link>
                </div>
            </div>

            {draftPosts?.length !== 0 ? (
                <>
                    <div className="flex items-center gap-2 mb-6">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {news.length} draft{news.length !== 1 ? 's' : ''} found
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {news.map((post, index) => (
                            <Card key={index} className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{post?.title}</h2>
                                        <Badge variant="secondary" className="shrink-0 text-xs font-medium">
                                            {post?.categorySlug}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <div className="flex flex-col gap-1">
                                                <span>
                                                    Created: <span className="text-foreground font-medium">{post && formatCreatedAt(post.createdAt)}</span>
                                                </span>
                                                <span>
                                                    Updated: <span className="text-foreground font-medium">{post && formatCreatedAt(post.updatedAt)}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0">
                                    <Link href={`/preview/${post?.id}`} className="w-full">
                                        <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Edit3 className="h-4 w-4" />
                                            Preview & Edit
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No drafts found</h2>
                    <p className="text-muted-foreground text-center mb-8 max-w-md">You haven't created any draft posts yet. Start writing your first article to see it here.</p>
                    <Link href="/editor">
                        <Button size="lg" className="gap-2">
                            <Plus className="h-5 w-5" />
                            Create Your First Draft
                        </Button>
                    </Link>
                </div>
            )}
        </AdminWrapper>
    );
}
