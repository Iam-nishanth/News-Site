import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true, title: true,
            }
        })
        const categoryTitles = categories.map(category => category.title);
        return NextResponse.json({
            message: "Categories fetched successfully",
            categories: categoryTitles
        })
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}