"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: { email: string };
  items: any[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const response = await fetch("/api/admin/orders");
    const data = await response.json();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      fetchOrders();
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des Commandes</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4">{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">{order.user?.email}</td>
                <td className="px-6 py-4">{formatPrice(order.total)}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm ${order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                      order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                        order.status === "CONFIRMED" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                      }`}
                  >
                    <option value="PENDING">En attente</option>
                    <option value="CONFIRMED">Confirmée</option>
                    <option value="SHIPPED">Expédiée</option>
                    <option value="DELIVERED">Livrée</option>
                    <option value="CANCELLED">Annulée</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
