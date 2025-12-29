"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";

export default function NewCompanionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            instructions: formData.get("instructions"),
            seed: formData.get("seed"),
            src: imageUrl || "🤖",
            categoryId: formData.get("categoryId"),
        };

        try {
            const res = await fetch("/api/companion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                setError(error.error || "Failed to create companion");
                return;
            }

            const companion = await res.json();
            router.push(`/chat/${companion.id}`);
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <Link href="/" className="text-white hover:text-purple-400">
                        ← Back
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Create Companion</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
                            Avatar
                        </label>
                        <ImageUpload
                            value={imageUrl}
                            onChange={setImageUrl}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Elon Musk"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <input
                            name="description"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="CEO of Tesla & SpaceX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Instructions
                        </label>
                        <textarea
                            name="instructions"
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="You are Elon Musk. You speak about technology, innovation, and the future of humanity..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Example Conversation
                        </label>
                        <textarea
                            name="seed"
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Human: What's your vision for the future?\nElon: I believe humanity needs to become a multi-planetary species..."
                        />
                    </div>

                    <input type="hidden" name="categoryId" value="default" />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                    >
                        {loading ? "Creating..." : "Create Companion"}
                    </button>
                </form>
            </main>
        </div>
    );
}
