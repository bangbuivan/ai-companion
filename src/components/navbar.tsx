"use client";

import Link from "next/link";
import { Sparkles, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const Navbar = () => {
    const pathname = usePathname();

    const routes = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/companion/new",
            label: "Create",
            active: pathname === "/companion/new",
        },
    ];

    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-black/20 backdrop-blur-lg h-16">
            <div className="flex items-center gap-2">
                <Link href="/">
                    <h1 className="hidden md:block text-xl md:text-2xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer">
                        AI Companion
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-x-3">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-white",
                            route.active ? "text-white" : "text-gray-400"
                        )}
                    >
                        {route.label}
                    </Link>
                ))}
                <form action="/api/auth/logout" method="POST">
                    <button
                        className={buttonVariants({ size: "sm", variant: "ghost" })}
                    >
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
};
