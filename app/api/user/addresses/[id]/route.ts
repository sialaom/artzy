import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const addressId = params.id;

        // Verify the address belongs to the user
        const address = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!address || address.userId !== session.user.id) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }

        await prisma.address.delete({
            where: { id: addressId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const addressId = params.id;
        const body = await request.json();

        // Verify ownership
        const existing = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }

        if (body.isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false },
            });
        }

        const updated = await prisma.address.update({
            where: { id: addressId },
            data: body,
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
