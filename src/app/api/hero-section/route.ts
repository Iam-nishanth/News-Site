import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const heroSection = await prisma.heroSection.findMany({
            include: {
                news: true
            },
            orderBy: {
                position: 'asc'
            }
        });
        return NextResponse.json({ heroSection });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { newsSlug, position } = await req.json();

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
                news: true
            }
        });

        return NextResponse.json({ heroItem });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add news to hero section' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { position } = await req.json();

        await prisma.heroSection.delete({
            where: { position }
        });

        return NextResponse.json({ message: 'Hero section item deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete hero section item' }, { status: 500 });
    }
}
