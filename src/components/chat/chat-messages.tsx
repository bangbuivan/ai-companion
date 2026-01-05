"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
    messages: {
        role: string;
        content: string;
    }[];
    isLoading: boolean;
    companion: {
        src: string;
        name: string;
    };
}

export const ChatMessages = ({
    messages = [],
    isLoading,
    companion,
}: ChatMessagesProps) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
                {messages.map((message, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex w-full items-start gap-3",
                            message.role === "user" && "flex-row-reverse"
                        )}
                    >
                        {message.role !== "user" && (
                            <Avatar src={companion.src} alt={companion.name} className="mt-1" />
                        )}

                        <div
                            className={cn(
                                "group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                message.role === "user"
                                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                                    : "bg-white/10 text-gray-100"
                            )}
                        >
                            {message.role === "user" ? (
                                message.content
                            ) : (
                                <ReactMarkdown
                                    components={{
                                        pre: ({ node, ...props }) => (
                                            <div className="overflow-auto w-full my-2 bg-black/50 p-2 rounded-lg">
                                                <pre {...props} />
                                            </div>
                                        ),
                                        code: ({ node, ...props }) => (
                                            <code className="bg-black/30 rounded-md px-1" {...props} />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul className="list-disc list-inside my-1" {...props} />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol className="list-decimal list-inside my-1" {...props} />
                                        ),
                                        a: ({ node, ...props }) => (
                                            <a
                                                className="text-purple-300 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                {...props}
                                            />
                                        ),
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex w-full items-start gap-3">
                        <Avatar src={companion.src} alt={companion.name} className="mt-1" />
                        <div className="flex items-center gap-1 rounded-2xl bg-white/10 px-4 py-3">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>
        </div>
    );
};
