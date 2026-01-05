"use client";

import { useState, useEffect, use } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

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
    const [loading, setLoading] = useState(false);
    const [companion, setCompanion] = useState<Companion | null>(null);

    useEffect(() => {
        fetch(`/api/chat/${chatId}`)
            .then((res) => res.json())
            .then((data) => {
                setCompanion(data.companion);
                setMessages(data.messages || []);
            });
    }, [chatId]);

    const handleSubmit = async (value: string) => {
        const userMessage = value;
        setLoading(true);

        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), role: "user", content: userMessage },
        ]);

        try {
            const res = await fetch(`/api/chat/${chatId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: "assistant", content: data.response },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!companion) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <ChatHeader companion={companion} />
            <ChatMessages
                messages={messages}
                isLoading={loading}
                companion={companion}
            />
            <ChatInput isLoading={loading} onSubmit={handleSubmit} />
        </div>
    );
}

