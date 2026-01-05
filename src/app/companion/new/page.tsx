"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";

import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewCompanionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

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
                toast.error(error.error || "Failed to create companion");
                return;
            }

            toast.success("Companion created successfully!");
            const companion = await res.json();
            router.push(`/chat/${companion.id}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center p-4">
            <main className="max-w-2xl w-full">
                <div className="my-8 text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Create Companion
                    </h1>
                    <p className="text-gray-400">
                        Craft a new AI personality to chat with.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                    {/* Image Upload */}
                    <div className="space-y-4 w-full flex flex-col items-center justify-center">
                        <ImageUpload
                            value={imageUrl}
                            onChange={setImageUrl}
                            disabled={loading}
                        />
                        <p className="text-sm text-gray-400">
                            Companion Avatar
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Name</label>
                            <Input
                                name="name"
                                required
                                placeholder="e.g. Elon Musk"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Description</label>
                            <Input
                                name="description"
                                required
                                placeholder="e.g. CEO of Tesla"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Instructions
                        </label>
                        <Textarea
                            name="instructions"
                            required
                            rows={4}
                            placeholder="Describe how your companion should behave..."
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500">
                            Detailed instructions for the AI's behavior and personality.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Example Conversation
                        </label>
                        <Textarea
                            name="seed"
                            required
                            rows={4}
                            placeholder="Human: Hello&#10;AI: Hi there!"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500">
                            Provide a few turn-by-turn examples to seed the conversation style.
                        </p>
                    </div>

                    <input type="hidden" name="categoryId" value="default" />

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="gradient"
                        size="lg"
                        className="w-full"
                        isLoading={loading}
                    >
                        Create Companion
                        <Wand2 className="w-4 h-4 ml-2" />
                    </Button>
                </form>
            </main>
        </div>
    );
}

