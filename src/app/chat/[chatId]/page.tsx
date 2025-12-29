"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Image from "next/image";

interface Message {
    id: string;
    role: string;
    content: string;
}

interface Companion {
    id: string;
    name: string;
    description: string;
    src: string;
}

export default function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
    const { chatId } = use(params);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [companion, setCompanion] = useState<Companion | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`/api/chat/${chatId}`)
            .then((res) => res.json())
            .then((data) => {
                setCompanion(data.companion);
                setMessages(data.messages || []);
            });
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), role: "user", content: userMessage },
        ]);
        setLoading(true);

        try {
            const res = await fetch(`/api/chat/${chatId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), role: "assistant", content: data.response },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderAvatar = () => {
        if (companion?.src && companion.src.startsWith("data:")) {
            return (
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image
                        src={companion.src}
                        alt={companion.name}
                        fill
                        className="object-cover"
                    />
                </div>
            );
        }
        return (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {companion?.src || "🤖"}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg flex-shrink-0">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-white hover:text-purple-400">
                        ←
                    </Link>
                    <div className="flex items-center gap-3">
                        {renderAvatar()}
                        <div>
                            <h1 className="text-lg font-semibold text-white">
                                {companion?.name || "Loading..."}
                            </h1>
                            <p className="text-sm text-gray-400">{companion?.description}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] p-4 rounded-2xl ${message.role === "user"
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/10 text-gray-100"
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 text-gray-400 p-4 rounded-2xl">
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input */}
            <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg flex-shrink-0">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-4xl mx-auto p-4 flex gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
                    >
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
}
