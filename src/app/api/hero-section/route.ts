import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const heroSection = await prisma.heroSection.findMany({
            include: {
                news: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                position: 'asc'
            }
        });
        return NextResponse.json({ heroSection });
    } catch (error) {
        console.error('Error fetching hero section:', error);
        return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { newsSlug, position } = await req.json();

        if (!newsSlug || position === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingPosition = await prisma.heroSection.findUnique({
            where: { position }
        });

        if (existingPosition) {
            return NextResponse.json({ error: 'Position already occupied' }, { status: 400 });
        }

        const heroItem = await prisma.heroSection.create({
            data: {
                newsSlug,
                position
            },
            include: {
                news: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({ heroItem });
    } catch (error) {
        console.error('Error adding news to hero section:', error);
        return NextResponse.json({ error: 'Failed to add news to hero section' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { position } = await req.json();

        if (position === undefined) {
            return NextResponse.json({ error: 'Position is required' }, { status: 400 });
        }

        await prisma.heroSection.delete({
            where: { position }
        });

        return NextResponse.json({ message: 'Hero section item deleted' });
    } catch (error) {
        console.error('Error deleting hero section item:', error);
        return NextResponse.json({ error: 'Failed to delete hero section item' }, { status: 500 });
    }
}
