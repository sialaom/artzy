"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  popularProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    popularProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Erreur serveur");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold mb-4">Impossible de charger les statistiques.</p>
        <Button onClick={fetchStats} variant="outline">Réessayer</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Chiffre d&apos;affaires</p>
              <p className="text-2xl font-bold mt-2">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Commandes</p>
              <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Produits</p>
              <p className="text-2xl font-bold mt-2">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Utilisateurs</p>
              <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Commandes récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Client</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Statut</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2">{order.id.slice(0, 8)}</td>
                  <td className="py-2">{order.user?.email}</td>
                  <td className="py-2">{formatPrice(order.total)}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                      order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                        order.status === "CONFIRMED" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Produits populaires</h2>
        <div className="space-y-2">
          {stats.popularProducts?.map((product) => (
            <div key={product.id} className="flex justify-between items-center py-2 border-b">
              <span>{product.name}</span>
              <span className="text-gray-600">{product._count.orderItems} commandes</span>
            </div>
          ))}
          {(!stats.popularProducts || stats.popularProducts.length === 0) && (
            <p className="text-gray-500 text-center py-4">Aucun produit populaire à afficher.</p>
          )}
        </div>
      </div>
    </div>
  );
}
