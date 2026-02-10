"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
}

interface Favorite {
    id: string;
    productId: string;
    product: Product;
}

export default function FavoritesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchFavorites();
        }
    }, [session]);

    const fetchFavorites = async () => {
        try {
            const response = await fetch("/api/user/favorites");
            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId: string) => {
        try {
            const response = await fetch("/api/user/favorites", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            if (response.ok) {
                setFavorites(favorites.filter((f) => f.productId !== productId));
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold">Accès refusé</h2>
                <Button className="mt-6" onClick={() => router.push("/auth/signin")}>
                    Se connecter
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Mes Favoris</h1>
                <p className="text-gray-500 mt-1">Retrouvez tous les produits que vous avez aimés</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-50 h-80 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-red-500 fill-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Votre liste est vide</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        Vous n'avez pas encore ajouté de coups de cœur. Explorez nos produits et cliquez sur le cœur pour les enregistrer ici.
                    </p>
                    <Link href="/products" className="mt-8 inline-block">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-6 h-auto text-lg">
                            Découvrir nos produits
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {favorites.map((fav) => (
                        <div
                            key={fav.id}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                {fav.product.images && fav.product.images[0] ? (
                                    <Image
                                        src={fav.product.images[0]}
                                        alt={fav.product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ShoppingBag className="w-12 h-12" />
                                    </div>
                                )}
                                <button
                                    onClick={() => removeFavorite(fav.productId)}
                                    className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md"
                                    title="Retirer des favoris"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6">
                                <Link href={`/products/${fav.productId}`}>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                        {fav.product.name}
                                    </h3>
                                </Link>
                                <p className="text-indigo-600 font-bold mt-2 text-lg">
                                    {formatPrice(fav.product.price)}
                                </p>

                                <Link href={`/products/${fav.productId}`} className="mt-4 block">
                                    <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600">
                                        Voir le produit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
