"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, BarChart3, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">Artzy Admin</h1>
          </div>
          <nav className="mt-8">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100"
            >
              <Package className="w-5 h-5" />
              Produits
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100"
            >
              <ShoppingCart className="w-5 h-5" />
              Commandes
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100"
            >
              <Users className="w-5 h-5" />
              Utilisateurs
            </Link>
          </nav>
          <div className="absolute bottom-0 w-64 p-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
