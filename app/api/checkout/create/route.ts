import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";



export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-02-24.acacia" as any,
  });
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, giftWrap, shippingCost } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
    }

    // Wrap everything in a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify stock for all items first
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Produit ${item.productId} non trouvé`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour ${product.name} (Disponible: ${product.stock})`);
        }
      }

      // 2. Create shipping address
      const address = await tx.address.create({
        data: {
          userId: session.user.id,
          label: "Livraison",
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone,
          governorate: shippingAddress.governorate,
          city: shippingAddress.city,
          street: shippingAddress.street,
          postalCode: shippingAddress.postalCode,
          isDefault: false,
        },
      });

      // 3. Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      const giftWrapCost = giftWrap ? 5 : 0;
      const total = subtotal + shippingCost + giftWrapCost;

      // 4. Create order
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          shippingAddressId: address.id,
          subtotal,
          shippingCost,
          giftWrapCost,
          total,
          status: "PENDING",
          customizations: items.map((item: any) => item.customization).filter(Boolean),
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              customization: item.customization || null,
            })),
          },
        },
      });

      // 5. Update stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });

    // Create Stripe Payment Intent (outside transaction since it's an external API call)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(result.total * 1000), // Convert TND to millimes
      currency: "tnd",
      metadata: {
        orderId: result.id,
        userId: session.user.id,
      },
    });

    // Update order with payment intent
    await prisma.order.update({
      where: { id: result.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: result.id,
    });
  } catch (error: any) {
    if (error.message && error.message.includes("Stock insuffisant")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
