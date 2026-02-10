import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                product: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(favorites);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { productId } = await request.json();

        const favorite = await prisma.favorite.upsert({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
            update: {},
            create: {
                userId: session.user.id,
                productId,
            },
        });

        return NextResponse.json(favorite);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { productId } = await request.json();

        await prisma.favorite.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
