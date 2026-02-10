"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Heart } from "lucide-react";
import ProductCustomization from "@/components/product-customization";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  isCustomizable: boolean;
  customizationOptions: any;
  stock: number;
  isFavorite?: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<any>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setIsFavorite(data.isFavorite || false);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, fetchProduct]);

  const toggleFavorite = async () => {
    try {
      setIsFavoriting(true);
      const response = await fetch("/api/user/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: params.id }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else if (response.status === 401) {
        window.location.href = "/auth/signin";
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.isCustomizable && !customization) {
      setShowCustomization(true);
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || "",
      price: product.price,
      quantity,
      stock: product.stock,
      customization: customization || undefined,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center">Produit non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="relative">
          <div className="relative h-[600px] w-full mb-6">
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-3xl flex items-center justify-center">
                <span className="text-gray-400">Aucune image disponible</span>
              </div>
            )}
            <button
              onClick={toggleFavorite}
              disabled={isFavoriting}
              className={`absolute top-6 right-6 p-4 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 z-10 ${isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-800 hover:bg-white"
                }`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-24 w-full rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === idx ? "ring-4 ring-indigo-500 scale-95 shadow-lg" : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-indigo-600">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">En stock</span>
              ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Rupture de stock</span>
              )}
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-8 bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-8">
            {product.isCustomizable && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Personnalisation</h3>
                {showCustomization ? (
                  <ProductCustomization
                    options={product.customizationOptions}
                    onCustomize={(custom) => {
                      setCustomization(custom);
                      setShowCustomization(false);
                    }}
                  />
                ) : (
                  <Button
                    onClick={() => setShowCustomization(true)}
                    variant="outline"
                    className="w-full py-6 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    Configurer ma personnalisation
                  </Button>
                )}
                {customization && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-sm text-indigo-700 font-medium">✨ Personnalisation prête !</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Quantité</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center p-1 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-30"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="text-sm text-red-500 font-bold animate-pulse">
                    Dépêchez-vous, plus que {product.stock} !
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {product.stock > 0 ? (
              <Button
                onClick={handleAddToCart}
                className="w-full py-8 text-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Ajouter au panier • {formatPrice(product.price * quantity)}
              </Button>
            ) : (
              <Button disabled className="w-full py-8 text-xl font-bold rounded-2xl opacity-50 cursor-not-allowed">
                Victime de son succès
              </Button>
            )}
            <p className="text-center text-xs text-gray-400">
              Livraison rapide en Tunisie • Paiement à la livraison possible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
