"use client";

import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <Link href="/products">
          <Button>Continuer vos achats</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panier</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${JSON.stringify(item.customization)}`} className="bg-white p-6 rounded-lg shadow flex gap-4">
              {item.productImage && (
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    {item.customization && (
                      <div className="text-sm text-gray-600 mt-1">
                        {item.customization.text && <p>Texte: {item.customization.text}</p>}
                        {item.customization.color && <p>Couleur: {item.customization.color}</p>}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    {item.quantity >= item.stock && (
                      <p className="text-[10px] text-orange-600 font-medium">Stock max atteint ({item.stock})</p>
                    )}
                  </div>
                  <div className="font-bold text-lg text-indigo-900 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4 border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Livraison</span>
                <span>Calculé à l'étape suivante</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-black text-indigo-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="block">
              <Button className="w-full py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all" size="lg">
                Passer la commande
              </Button>
            </Link>
            <p className="text-center text-xs text-gray-400 mt-4">
              Paiement sécurisé par Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
