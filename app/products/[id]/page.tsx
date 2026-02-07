"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
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

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    const response = await fetch(`/api/products/${params.id}`);
    const data = await response.json();
    setProduct(data);
    setLoading(false);
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
      customization: customization || undefined,
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-12 text-center">Produit non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative h-96 w-full mb-4">
            {product.images[selectedImage] && (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-full rounded ${
                    selectedImage === idx ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover rounded" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="text-3xl font-bold text-primary mb-6">
            {formatPrice(product.price)}
          </div>

          {product.isCustomizable && (
            <div className="mb-6">
              {showCustomization ? (
                <ProductCustomization
                  options={product.customizationOptions}
                  onCustomize={(custom) => {
                    setCustomization(custom);
                    setShowCustomization(false);
                  }}
                />
              ) : (
                <Button onClick={() => setShowCustomization(true)}>
                  Personnaliser ce produit
                </Button>
              )}
              {customization && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Personnalisation appliquée</p>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantité</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border rounded"
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 border rounded"
              >
                +
              </button>
            </div>
          </div>

          {product.stock > 0 ? (
            <Button onClick={handleAddToCart} className="w-full" size="lg">
              Ajouter au panier
            </Button>
          ) : (
            <Button disabled className="w-full" size="lg">
              Rupture de stock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
