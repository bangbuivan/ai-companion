"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(value);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert to base64 for simple storage
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPreview(base64);
            onChange(base64);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                className={`
                    relative w-40 h-40 mx-auto rounded-xl overflow-hidden
                    border-2 border-dashed border-white/30 
                    hover:border-purple-500 transition cursor-pointer
                    flex items-center justify-center
                    bg-white/5
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                {preview ? (
                    <Image
                        src={preview}
                        alt="Companion avatar"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-sm">Click to upload</p>
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled}
                className="hidden"
            />
            {preview && (
                <button
                    type="button"
                    onClick={() => {
                        setPreview("");
                        onChange("");
                    }}
                    className="w-full text-center text-sm text-red-400 hover:text-red-300"
                >
                    Remove image
                </button>
            )}
        </div>
    );
}
