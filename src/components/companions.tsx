"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, Plus, Search } from "lucide-react";
import { Companion, Category } from "@prisma/client";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface CompanionsProps {
    data: (Companion & {
        _count: {
            messages: number;
        };
    })[];
    categories: Category[];
}

export const Companions = ({ data, categories }: CompanionsProps) => {
    const [search, setSearch] = React.useState("");
    const [categoryId, setCategoryId] = React.useState<string | null>(null);

    const filteredCompanions = data.filter((companion) => {
        const matchesSearch = companion.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory = categoryId ? companion.categoryId === categoryId : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search companions..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Link
                    href="/companion/new"
                    className={buttonVariants({ variant: "gradient", size: "sm" })}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Companion
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={() => setCategoryId(null)}
                    variant={categoryId === null ? "secondary" : "ghost"}
                    size="sm"
                >
                    All
                </Button>
                {categories.map((item) => (
                    <Button
                        key={item.id}
                        onClick={() => setCategoryId(item.id)}
                        variant={categoryId === item.id ? "secondary" : "ghost"}
                        size="sm"
                    >
                        {item.name}
                    </Button>
                ))}
            </div>

            {filteredCompanions.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-3 py-10">
                    <div className="relative h-60 w-60">
                        <div className="text-6xl text-center">🕵️</div>
                    </div>
                    <p className="text-sm text-gray-400">No companions found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 pb-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {filteredCompanions.map((item) => (
                        <Card
                            key={item.id}
                            className="group cursor-pointer border-0 bg-white/5 transition hover:bg-white/10 overflow-hidden"
                        >
                            <Link href={`/chat/${item.id}`}>
                                <CardHeader className="flex flex-col items-center justify-center p-4 text-center text-gray-400">
                                    <div className="relative h-32 w-32 overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4 transition group-hover:scale-105">
                                        <Avatar
                                            src={item.src}
                                            alt={item.name}
                                            className="h-full w-full rounded-none"
                                        />
                                    </div>
                                    <p className="font-bold text-white mb-1 transition group-hover:text-purple-400">
                                        {item.name}
                                    </p>
                                    <p className="text-xs line-clamp-2">{item.description}</p>
                                </CardHeader>
                                <CardFooter className="flex items-center justify-between p-4 pt-0 text-xs text-gray-400">
                                    <div className="flex items-center lowercase">
                                        @{categories.find((c) => c.id === item.categoryId)?.name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        {item._count.messages}
                                    </div>
                                </CardFooter>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
