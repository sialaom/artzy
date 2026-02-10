"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
    const router = useRouter();

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

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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
            const response = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                    stock: parseInt(formData.stock),
                    images: ["https://picsum.photos/seed/" + Math.random() + "/800/800"] // Default test image
                }),
            });

            if (response.ok) {
                router.push("/admin/products");
            } else {
                const data = await response.json();
                setError(data.error || "Une erreur est survenue lors de la création");
            }
        } catch (error) {
            setError("Une erreur est survenue");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h1>

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
                        {saving ? "Création..." : "Créer le produit"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
