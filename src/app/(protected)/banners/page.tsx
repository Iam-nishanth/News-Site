'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2Icon, TrashIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getHeroSection, updateHeroSectionOrder, removeFromHeroSection } from '@/utils/actions/heroActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import AddHeroArticle from '@/components/hero-article-dialog';
import AdminWrapper from '@/components/admin-components/AdminWrapper';

interface HeroArticle {
    position: number;
    news: {
        id: string;
        title: string;
        slug: string;
        categorySlug: string | null;
        featuredImg: string | null;
        cat: {
            title: string | null;
        } | null;
    };
}

interface DraggableArticleProps {
    article: HeroArticle;
    handleRemove: (position: number) => void;
}

const SortableArticle = ({ article, handleRemove }: DraggableArticleProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: article.news.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn('border rounded-lg p-3 bg-card flex items-center space-x-3', isDragging && 'opacity-50')}>
            <div className="relative h-12 w-20 rounded overflow-hidden">
                <Image src={article.news.featuredImg || '/placeholder.svg'} alt={article.news.title} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="flex-1">
                <div className="flex items-center">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full mr-2">{article.position}</span>
                    <span className="text-xs text-muted-foreground">{article.news.cat?.title || article.news.categorySlug}</span>
                </div>
                <h3 className="font-medium text-sm mt-1 line-clamp-1">{article.news.title}</h3>
            </div>
            <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemove(article.position)}>
                    <TrashIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default function HeroSectionPage() {
    const [heroArticles, setHeroArticles] = useState<HeroArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    useEffect(() => {
        const loadHeroSection = async () => {
            const data = await getHeroSection();
            if (data) {
                setHeroArticles(data);
            }
            setIsLoading(false);
        };
        loadHeroSection();
    }, []);

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setHeroArticles((items) => {
                const oldIndex = items.findIndex((item) => item.news.id === active.id);
                const newIndex = items.findIndex((item) => item.news.id === over.id);

                const reorderedArticles = arrayMove(items, oldIndex, newIndex).map((article, index) => ({
                    ...article,
                    position: index + 1
                }));

                // Update in database
                updateHeroSectionOrder(
                    reorderedArticles.map((article) => ({
                        newsSlug: article.news.slug,
                        position: article.position
                    }))
                ).then((result) => {
                    if (!result.success) {
                        toast.error('Failed to update hero section order');
                    }
                });

                return reorderedArticles;
            });
        }
    };

    const handleRemove = async (position: number) => {
        if (window.confirm('Are you sure you want to remove this article from the hero section?')) {
            const result = await removeFromHeroSection(position);
            if (result.success) {
                setHeroArticles(heroArticles.filter((article) => article.position !== position));
                toast.success('Article removed from hero section');
            } else {
                toast.error('Failed to remove article from hero section');
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AdminWrapper className="flex flex-col gap-2 py-3">
            <h1 className="text-2xl font-bold">Hero Section</h1>
            <p className="text-muted-foreground">Drag and drop to reorder articles in the hero section.</p>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Banner Articles</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Article
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Article to Hero Section</DialogTitle>
                            </DialogHeader>
                            <AddHeroArticle
                                onAdd={(article: HeroArticle) => {
                                    setHeroArticles([...heroArticles, article]);
                                }}
                                currentPositions={heroArticles.map((a) => a.position)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={heroArticles.map((article) => article.news.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
                                {heroArticles.map((article) => (
                                    <SortableArticle key={article.news.id} article={article} handleRemove={handleRemove} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </CardContent>
            </Card>
        </AdminWrapper>
    );
}
