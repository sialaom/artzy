"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Trash2, Home, Briefcase, Check } from "lucide-react";
import { TUNISIAN_GOVERNORATES } from "@/lib/utils";

interface Address {
    id: string;
    label: string;
    firstName: string;
    lastName: string;
    phone: string;
    governorate: string;
    city: string;
    street: string;
    postalCode: string | null;
    isDefault: boolean;
}

export default function AddressesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        label: "Maison",
        firstName: "",
        lastName: "",
        phone: "",
        governorate: "Tunis",
        city: "",
        street: "",
        postalCode: "",
        isDefault: false,
    });

    useEffect(() => {
        if (session) {
            fetchAddresses();
        }
    }, [session]);

    const fetchAddresses = async () => {
        try {
            const response = await fetch("/api/user/addresses");
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setShowAddForm(false);
                fetchAddresses();
                setFormData({
                    label: "Maison",
                    firstName: "",
                    lastName: "",
                    phone: "",
                    governorate: "Tunis",
                    city: "",
                    street: "",
                    postalCode: "",
                    isDefault: false,
                });
            }
        } catch (error) {
            console.error("Error saving address:", error);
        } finally {
            setSaving(false);
        }
    };

    const deleteAddress = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;
        try {
            const response = await fetch(`/api/user/addresses/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchAddresses();
            }
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold">Accès refusé</h2>
                <Button className="mt-6" onClick={() => router.push("/auth/signin")}>
                    Se connecter
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mes Adresses</h1>
                    <p className="text-gray-500 mt-1">Gérez vos adresses de livraison</p>
                </div>
                {!showAddForm && (
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une adresse
                    </Button>
                )}
            </div>

            {showAddForm && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h2 className="text-xl font-bold mb-6">Nouvelle Adresse</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Libellé (ex: Maison, Bureau)</label>
                                <div className="flex gap-2">
                                    {["Maison", "Bureau", "Autre"].map((l) => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, label: l })}
                                            className={`flex-1 py-2 px-4 rounded-xl border transition-all ${formData.label === l
                                                    ? "bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold"
                                                    : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                                                }`}
                                        >
                                            {l === "Maison" && <Home className="w-4 h-4 inline mr-2" />}
                                            {l === "Bureau" && <Briefcase className="w-4 h-4 inline mr-2" />}
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Gouvernorat</label>
                                <select
                                    value={formData.governorate}
                                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                >
                                    {TUNISIAN_GOVERNORATES.map((gov) => (
                                        <option key={gov} value={gov}>{gov}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Prénom</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Téléphone (+216)</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Ville</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Adresse (Rue, bâtiment, appartement)</label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">Définir comme adresse par défaut</label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 py-6 rounded-xl"
                                onClick={() => setShowAddForm(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 py-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                                disabled={saving}
                            >
                                {saving ? "Enregistrement..." : "Enregistrer l'adresse"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-gray-50 h-48 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Aucune adresse</h3>
                    <p className="text-gray-500 mt-2">Vous n'avez pas encore ajouté d'adresse de livraison.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`relative bg-white p-6 rounded-2xl shadow-sm border-2 transition-all hover:shadow-md ${address.isDefault ? "border-indigo-600" : "border-gray-100"
                                }`}
                        >
                            {address.isDefault && (
                                <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Par défaut
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                    {address.label === "Maison" ? <Home className="w-5 h-5" /> : address.label === "Bureau" ? <Briefcase className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                </div>
                                <h3 className="font-bold text-gray-900">{address.label}</h3>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600 mb-6">
                                <p className="font-semibold text-gray-900">{address.firstName} {address.lastName}</p>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.governorate}</p>
                                {address.postalCode && <p>{address.postalCode}</p>}
                                <p>{address.phone}</p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                                    onClick={() => deleteAddress(address.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
