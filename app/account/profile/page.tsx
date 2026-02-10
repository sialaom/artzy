"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch("/api/user/profile");
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    ...formData,
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }, [formData]);

    useEffect(() => {
        if (session) {
            fetchProfile();
        }
    }, [session, fetchProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
            setSaving(false);
            return;
        }

        try {
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password || undefined,
                }),
            });

            if (response.ok) {
                setMessage({ type: "success", text: "Profil mis à jour avec succès. Redirection..." });
                // Update session if email or name changed
                await update({
                    user: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                    }
                });

                // Wait a bit then redirect
                setTimeout(() => {
                    router.push("/account");
                }, 1500);
            } else {
                const error = await response.json();
                setMessage({ type: "error", text: error.error || "Une erreur est survenue" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Une erreur est survenue" });
        } finally {
            setSaving(false);
        }
    };

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold">Accès refusé</h2>
                <p className="mt-4">Veuillez vous connecter pour accéder à cette page.</p>
                <Button className="mt-6" onClick={() => router.push("/auth/signin")}>
                    Se connecter
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">Chargement de votre profil...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-10 text-white">
                    <h1 className="text-3xl font-bold">Modifier mon profil</h1>
                    <p className="opacity-90 mt-2">Gérez vos informations personnelles et votre compte</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {message.text && (
                        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Prénom</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Nom</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+216 22 123 456"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <hr className="my-8 border-gray-100" />

                    <h3 className="text-lg font-bold text-gray-800 mb-4">Changer le mot de passe</h3>
                    <p className="text-sm text-gray-500 mb-4">Laissez vide si vous ne souhaitez pas modifier votre mot de passe</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Nouveau mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 py-6 rounded-xl"
                            onClick={() => router.back()}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 py-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02]"
                            disabled={saving}
                        >
                            {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
