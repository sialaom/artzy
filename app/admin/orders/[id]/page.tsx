"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";
import Image from "next/image";

interface Order {
    id: string;
    total: number;
    subtotal: number;
    shippingCost: number;
    status: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        street: string;
        city: string;
        governorate: string;
        postalCode: string;
    };
    items: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            images: string[];
        };
    }[];
}

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/admin/orders/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setOrder(data);
            }
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-12">Chargement...</div>;
    if (!order) return <div className="text-center py-12">Commande non trouvée</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Button
                variant="ghost"
                className="mb-6"
                onClick={() => router.back()}
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Commande #{order.id.slice(0, 8)}</h1>
                    <p className="text-gray-500">Passée le {new Date(order.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                        order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                            order.status === "CONFIRMED" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                    }`}>
                    {order.status}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Order Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-600" /> Articles
                        </h2>
                        <div className="divide-y">
                            {order.items.map((item) => (
                                <div key={item.id} className="py-4 flex gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0">
                                        <Image
                                            src={item.product.images[0] || "https://picsum.photos/200"}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-gray-500 text-sm">Quantité: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-bold mb-4">Résumé du paiement</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Sous-total</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frais de livraison</span>
                                <span>{formatPrice(order.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer & Shipping Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" /> Client
                        </h2>
                        <div className="text-sm space-y-1">
                            <p className="font-semibold">{order.user.firstName} {order.user.lastName}</p>
                            <p className="text-gray-500">{order.user.email}</p>
                            <p className="text-gray-500">{order.user.phone}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-600" /> Livraison
                        </h2>
                        <div className="text-sm space-y-1">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.governorate}</p>
                            <p>{order.shippingAddress.postalCode}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
