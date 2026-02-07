"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { formatPrice, TUNISIAN_GOVERNORATES, calculateShippingCost } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    governorate: "",
    city: "",
    street: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [session, router]);

  const shippingCost = formData.governorate
    ? calculateShippingCost(formData.governorate)
    : 0;
  const finalTotal = total + shippingCost + (giftWrap ? 5 : 0);

  const handleStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    setStep(2);
  };

  const handleStep2 = () => {
    if (!formData.governorate || !formData.city || !formData.street) {
      alert("Veuillez remplir tous les champs d'adresse");
      return;
    }
    setStep(3);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: formData,
          giftWrap,
          shippingCost,
        }),
      });

      const data = await response.json();

      if (data.clientSecret) {
        // Redirect to Stripe Checkout or handle payment
        router.push(`/checkout/payment?clientSecret=${data.clientSecret}&orderId=${data.orderId}`);
      } else {
        alert("Erreur lors de la création de la commande");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Une erreur est survenue");
      setLoading(false);
    }
  };

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
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}>
              1
            </div>
            <span className="ml-2">Informations</span>
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`} />
          <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}>
              2
            </div>
            <span className="ml-2">Livraison</span>
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`} />
          <div className={`flex items-center ${step >= 3 ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}>
              3
            </div>
            <span className="ml-2">Paiement</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Customer Info */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Informations client</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <Button onClick={handleStep1} className="w-full">Continuer</Button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Gouvernorat</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    {TUNISIAN_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rue</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Code postal (optionnel)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="giftWrap"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                  />
                  <label htmlFor="giftWrap">Emballage cadeau (+5 TND)</label>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
                  <Button onClick={handleStep2} className="flex-1">Continuer</Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Paiement</h2>
              <p className="text-gray-600 mb-4">
                Le paiement sera traité via Stripe. Vous serez redirigé vers la page de paiement sécurisée.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>Retour</Button>
                <Button onClick={handlePayment} disabled={loading} className="flex-1">
                  {loading ? "Traitement..." : "Payer maintenant"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4">Résumé de commande</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{formData.governorate ? formatPrice(shippingCost) : "-"}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span>Emballage cadeau</span>
                  <span>{formatPrice(5)}</span>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
