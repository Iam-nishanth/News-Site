'use client';

import { useEffect, useState } from 'react';
import { News } from '@prisma/client';

interface HeroNews {
    position: number;
    news: News & {
        user: {
            name: string;
        };
    };
}

const HeroSectionAdmin = () => {
    const [heroNews, setHeroNews] = useState<HeroNews[]>([]);
    const [allNews, setAllNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [heroResponse, newsResponse] = await Promise.all([fetch('/api/hero-section'), fetch('/api/news')]);

                const heroData = await heroResponse.json();
                const newsData = await newsResponse.json();

                setHeroNews(heroData.heroSection);
                setAllNews(newsData.news);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddNews = async (position: number) => {
        if (!selectedNews[position]) return;

        try {
            const response = await fetch('/api/hero-section', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newsSlug: selectedNews[position],
                    position
                })
            });

            if (response.ok) {
                const data = await response.json();
                setHeroNews((prev) => [...prev, data.heroItem]);
                setSelectedNews((prev) => ({ ...prev, [position]: '' }));
            }
        } catch (error) {
            console.error('Failed to add news:', error);
        }
    };

    const handleRemoveNews = async (position: number) => {
        try {
            const response = await fetch('/api/hero-section', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ position })
            });

            if (response.ok) {
                setHeroNews((prev) => prev.filter((item) => item.position !== position));
            }
        } catch (error) {
            console.error('Failed to remove news:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Hero Section</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2, 3, 4].map((position) => {
                    const currentNews = heroNews.find((item) => item.position === position);

                    return (
                        <div key={position} className="border p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-2">Position {position + 1}</h2>
                            {currentNews ? (
                                <div>
                                    <p className="font-medium">{currentNews.news.title}</p>
                                    <p className="text-sm text-gray-600">By {currentNews.news.user.name}</p>
                                    <button onClick={() => handleRemoveNews(position)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <select
                                        value={selectedNews[position] || ''}
                                        onChange={(e) =>
                                            setSelectedNews((prev) => ({
                                                ...prev,
                                                [position]: e.target.value
                                            }))
                                        }
                                        className="w-full p-2 border rounded mb-2"
                                    >
                                        <option value="">Select News</option>
                                        {allNews.map((news) => (
                                            <option key={news.slug} value={news.slug}>
                                                {news.title}
                                            </option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleAddNews(position)} className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={!selectedNews[position]}>
                                        Add News
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HeroSectionAdmin;
