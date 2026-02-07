"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function AccountPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data);
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Veuillez vous connecter</h1>
        <Link href="/auth/signin">
          <Button>Se connecter</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Profil</h2>
            <p className="text-gray-600">{session.user?.email}</p>
            <Link href="/account/profile" className="text-primary hover:underline mt-4 block">
              Modifier le profil
            </Link>
            <Link href="/account/addresses" className="text-primary hover:underline mt-2 block">
              Mes adresses
            </Link>
            <Link href="/account/favorites" className="text-primary hover:underline mt-2 block">
              Mes favoris
            </Link>
          </div>
        </div>

        {/* Orders */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Historique des commandes</h2>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune commande pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Commande #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                        <span className={`text-sm px-2 py-1 rounded ${
                          order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                          order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                          order.status === "CONFIRMED" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status === "PENDING" && "En attente"}
                          {order.status === "CONFIRMED" && "Confirmée"}
                          {order.status === "SHIPPED" && "Expédiée"}
                          {order.status === "DELIVERED" && "Livrée"}
                          {order.status === "CANCELLED" && "Annulée"}
                        </span>
                      </div>
                    </div>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir les détails
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
