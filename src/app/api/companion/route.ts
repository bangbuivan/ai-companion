import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, instructions, seed, src, categoryId } = body;

        if (!name || !description || !instructions || !seed) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get or create default category
        let category = await prisma.category.findFirst({
            where: { name: "General" },
        });

        if (!category) {
            category = await prisma.category.create({
                data: { name: "General" },
            });
        }

        const companion = await prisma.companion.create({
            data: {
                name,
                description,
                instructions,
                seed,
                src: src || "🤖",
                userId: user.id,
                categoryId: category.id,
            },
        });

        return NextResponse.json(companion);
    } catch (error) {
        console.error("[COMPANION_POST]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
