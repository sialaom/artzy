import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    let isFavorite = false;
    if (session?.user?.id) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: params.id,
          },
        },
      });
      isFavorite = !!favorite;
    }

    return NextResponse.json({ ...product, isFavorite });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du produit" },
      { status: 500 }
    );
  }
}
