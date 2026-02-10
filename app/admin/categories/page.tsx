"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Category {
    id: string;
    name: string;
    _count?: {
        products: number;
    };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [newName, setNewName] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/admin/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setError("");
        try {
            const response = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
            if (response.ok) {
                setNewName("");
                setIsAdding(false);
                fetchCategories();
            } else {
                const data = await response.json();
                setError(data.error);
            }
        } catch (error) {
            setError("Une erreur est survenue");
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;
        setError("");
        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName }),
            });
            if (response.ok) {
                setEditingId(null);
                fetchCategories();
            } else {
                const data = await response.json();
                setError(data.error);
            }
        } catch (error) {
            setError("Une erreur est survenue");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
        setError("");
        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchCategories();
            } else {
                const data = await response.json();
                setError(data.error);
            }
        } catch (error) {
            setError("Une erreur est survenue");
        }
    };

    if (loading) return <div className="text-center py-12">Chargement...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
                    <Plus className="w-4 h-4 mr-2" /> Nouvelle catégorie
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 flex justify-between items-center">
                    {error}
                    <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produits</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isAdding && (
                            <tr className="bg-indigo-50/30">
                                <td className="px-6 py-4" colSpan={2}>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Nom de la catégorie..."
                                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <Button size="sm" onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
                                        <Check className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        )}

                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    {editingId === cat.id ? (
                                        <input
                                            autoFocus
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                                            onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                                        />
                                    ) : (
                                        <span className="font-medium text-gray-900">{cat.name}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                                        {cat._count?.products || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {editingId === cat.id ? (
                                            <>
                                                <Button size="sm" onClick={() => handleUpdate(cat.id)} className="bg-green-600 hover:bg-green-700">
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                    onClick={() => {
                                                        setEditingId(cat.id);
                                                        setEditName(cat.name);
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(cat.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && !isAdding && (
                    <div className="text-center py-12 text-gray-500">
                        Aucune catégorie définie.
                    </div>
                )}
            </div>
        </div>
    );
}
