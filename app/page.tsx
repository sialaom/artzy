import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Artzy</h1>
          <p className="text-2xl mb-8">Cadeaux Personnalisés en Tunisie</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Offrez des cadeaux uniques et personnalisés à vos proches. 
            Gravure, personnalisation, et bien plus encore !
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Découvrir nos produits
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Articles Populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Products will be loaded here */}
          <div className="text-center text-gray-500">
            Chargement des produits...
          </div>
        </div>
      </section>
    </main>
  );
}
