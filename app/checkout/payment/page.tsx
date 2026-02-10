"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
      },
    });

    if (error) {
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || loading} className="w-full" size="lg">
        {loading ? "Traitement..." : "Payer maintenant"}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("clientSecret");
  const orderId = searchParams.get("orderId");

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Erreur : Secret de paiement manquant</p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Paiement sécurisé</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          {stripePromise && clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              {orderId && <CheckoutForm orderId={orderId} />}
            </Elements>
          ) : (
            <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg">
              Configuration de paiement manquante. Veuillez vérifier les clés API Stripe.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
