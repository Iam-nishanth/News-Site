'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getAvailableArticles } from '@/utils/actions/heroActions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { toast } from 'sonner';

interface Article {
    id: string;
    title: string;
    slug: string;
    categorySlug: string | null;
    featuredImg: string | null;
    cat?: { title: string } | null;
}

interface AddHeroArticleProps {
    onAdd: (article: any) => void;
    currentPositions: number[];
}

export default function AddHeroArticle({ onAdd, currentPositions }: AddHeroArticleProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadArticles = async () => {
            const data = await getAvailableArticles();
            if (data) {
                const transformedData = data.map((article) => ({
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    categorySlug: article.categorySlug,
                    featuredImg: article.featuredImg,
                    cat: null
                }));
                setArticles(transformedData);
            }
            setIsLoading(false);
        };
        loadArticles();
    }, []);

    const handleAdd = async () => {
        if (!selectedArticle) {
            toast.error('Please select an article');
            return;
        }

        // Find the next available position
        const nextPosition = Math.max(...currentPositions, 0) + 1;

        try {
            const response = await fetch('/api/hero-section', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newsSlug: selectedArticle.slug,
                    position: nextPosition
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            onAdd(data.heroItem);
            toast.success('Article added to hero section');
        } catch (error) {
            toast.error('Failed to add article to hero section');
        }
    };

    if (isLoading) {
        return <div>Loading available articles...</div>;
    }

    if (articles.length === 0) {
        return <div className="text-muted-foreground text-center py-8">No articles available to add to the hero section.</div>;
    }

    return (
        <div className="space-y-4">
            <ScrollArea className="h-[300px] pr-4">
                <RadioGroup
                    value={selectedArticle?.id}
                    onValueChange={(value) => {
                        const found = articles.find((a) => a.id === value);
                        if (found) setSelectedArticle(found);
                    }}
                >
                    {articles.map((article) => (
                        <div key={article.id} className="flex items-center space-x-3 border rounded-lg p-3 mb-2">
                            <RadioGroupItem value={article.id} id={article.id} />
                            <div className="relative h-12 w-20 rounded overflow-hidden">
                                <Image src={article.featuredImg || '/placeholder.svg'} alt={article.title} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <Label htmlFor={article.id} className="flex-1">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{article.title}</span>
                                    <span className="text-xs text-muted-foreground">{article.cat?.title || article.categorySlug}</span>
                                </div>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </ScrollArea>
            <div className="flex justify-end">
                <Button onClick={handleAdd} disabled={!selectedArticle}>
                    Add to Hero Section
                </Button>
            </div>
        </div>
    );
}
