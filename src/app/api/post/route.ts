import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const post = await prisma.news.findUnique({
      where: { id: id },
      include: {
        comments: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "success", post: post });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching post" },
      { status: 500 }
    );
  }
}
