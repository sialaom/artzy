import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, giftWrap, shippingCost } = body;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        subtotal: body.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
        shippingCost,
        giftWrapCost: giftWrap ? 5 : 0,
        total: body.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) + shippingCost + (giftWrap ? 5 : 0),
        status: "PENDING",
        shippingAddressId: "", // Will be created below
        customizations: items.map((item: any) => item.customization).filter(Boolean),
      },
    });

    // Create shipping address
    const address = await prisma.address.create({
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

    // Update order with address
    await prisma.order.update({
      where: { id: order.id },
      data: { shippingAddressId: address.id },
    });

    // Create order items
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (product) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            customization: item.customization || null,
          },
        });

        // Update stock
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    // Create Stripe Payment Intent (in TND, multiply by 1000 for millimes)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 1000), // Convert TND to millimes
      currency: "tnd",
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    });

    // Update order with payment intent
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
