"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    const response = await fetch(`/api/orders/${orderId}`);
    if (response.ok) {
      const data = await response.json();
      setOrder(data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
        <p className="text-gray-600 mb-8">
          Merci pour votre achat. Votre commande a été reçue et sera traitée sous peu.
        </p>
        {order && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <p className="text-sm text-gray-600 mb-2">Numéro de commande</p>
            <p className="text-xl font-bold mb-4">{order.id}</p>
            {order.trackingNumber && (
              <>
                <p className="text-sm text-gray-600 mb-2">Numéro de suivi</p>
                <p className="text-lg font-semibold">{order.trackingNumber}</p>
              </>
            )}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Link href="/account">
            <Button variant="outline">Voir mes commandes</Button>
          </Link>
          <Link href="/products">
            <Button>Continuer les achats</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
