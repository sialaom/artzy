import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id: params.id },
            data: { name },
        });

        return NextResponse.json(category);
    } catch (error) {
        if ((error as any).code === "P2002") {
            return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        // Check if category has products
        const productCount = await prisma.product.count({
            where: { categoryId: params.id },
        });

        if (productCount > 0) {
            return NextResponse.json(
                { error: "Impossible de supprimer une catégorie qui contient des produits" },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
