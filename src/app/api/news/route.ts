import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    // const drafts = await prisma.draftPost.findMany()
    const news = await prisma.news.findMany()

    // return NextResponse.json({ message: "fetched", drafts: drafts })
    return NextResponse.json({ message: "fetched",count: news.length , news: news })
}


export async function POST(req: NextRequest) {
    const { news } = await req.json();

    return NextResponse.json(news)
}
