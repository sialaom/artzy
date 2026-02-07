"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Artzy
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/products" className="hover:text-primary">
              Produits
            </Link>
            <Link href="/cart" className="relative hover:text-primary">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {session ? (
              <>
                <Link href="/account" className="hover:text-primary">
                  <User className="w-6 h-6" />
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">Connexion</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
