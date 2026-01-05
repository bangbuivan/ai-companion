"use client";

import * as React from "react";
import { SendHorizonal } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { Button } from "@/components/ui/button";

interface ChatInputProps {
    isLoading: boolean;
    onSubmit: (message: string) => void;
}

export const ChatInput = ({ isLoading, onSubmit }: ChatInputProps) => {
    const [input, setInput] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (isLoading || !input.trim()) return;
        onSubmit(input);
        setInput("");
    };

    return (
        <div className="border-t border-white/10 bg-black/20 p-4 backdrop-blur-lg">
            <div className="mx-auto flex max-w-4xl items-end gap-2">
                <TextareaAutosize
                    rows={1}
                    maxRows={6}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 resize-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                    disabled={isLoading}
                />
                <Button
                    size="icon"
                    variant="gradient"
                    disabled={isLoading || !input.trim()}
                    onClick={handleSubmit}
                    className="h-[46px] w-[46px] rounded-xl shrink-0"
                >
                    <SendHorizonal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
