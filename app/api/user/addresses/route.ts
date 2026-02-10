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
        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(addresses);
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
        const body = await request.json();
        const { label, firstName, lastName, phone, governorate, city, street, postalCode, isDefault } = body;

        // If this is the default address, unset other default addresses
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: session.user.id,
                label,
                firstName,
                lastName,
                phone,
                governorate,
                city,
                street,
                postalCode,
                isDefault: isDefault || false,
            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error("Error creating address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
