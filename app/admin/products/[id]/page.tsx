"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        categoryId: "",
        stock: "",
        isActive: true,
        isCustomizable: false,
        images: [] as string[],
    });

    const fetchData = useCallback(async () => {
        try {
            const [categoriesRes, productRes] = await Promise.all([
                fetch("/api/admin/categories"),
                fetch(`/api/admin/products/${productId}`)
            ]);

            if (categoriesRes.ok) {
                const categoriesData = await categoriesRes.json();
                setCategories(categoriesData);
            }

            if (productRes.ok) {
                const data = await productRes.json();
                setFormData({
                    name: data.name,
                    description: data.description,
                    price: data.price.toString(),
                    originalPrice: data.originalPrice ? data.originalPrice.toString() : "",
                    categoryId: data.categoryId,
                    stock: data.stock.toString(),
                    isActive: data.isActive,
                    isCustomizable: data.isCustomizable,
                    images: data.images,
                });
            } else {
                setError("Impossible de charger le produit");
            }
        } catch (error) {
            setError("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchData();
    }, [productId, fetchData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setFormData({ ...formData, [name]: val });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                    stock: parseInt(formData.stock),
                }),
            });

            if (response.ok) {
                router.push("/admin/products");
            } else {
                const data = await response.json();
                setError(data.error || "Une erreur est survenue lors de la sauvegarde");
            }
        } catch (error) {
            setError("Une erreur est survenue");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12">Chargement...</div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow border">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Nom du produit</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        rows={4}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Prix actuel (TND) *</label>
                        <input
                            type="number"
                            step="0.001"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            required
                        />
                        <p className="text-xs text-gray-500">Le prix que les clients paieront</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Prix original (TND)</label>
                        <input
                            type="number"
                            step="0.001"
                            name="originalPrice"
                            value={formData.originalPrice}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Optionnel"
                        />
                        <p className="text-xs text-gray-500">Prix avant promotion (affiché barré)</p>
                        {formData.originalPrice && formData.price && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                            <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-xs font-bold">
                                🎉 Réduction de {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100)}%
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Catégorie</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        required
                    >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm font-semibold">Actif</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isCustomizable"
                            checked={formData.isCustomizable}
                            onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
                            className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm font-semibold">Personnalisable</span>
                    </label>
                </div>

                <div className="flex gap-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push("/admin/products")}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={saving}
                    >
                        {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
