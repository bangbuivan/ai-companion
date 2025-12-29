import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateChatResponse } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const { chatId } = await params;
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const companion = await prisma.companion.findUnique({
            where: { id: chatId },
        });

        if (!companion) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const messages = await prisma.message.findMany({
            where: {
                companionId: chatId,
                userId: user.id,
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({ companion, messages });
    } catch (error) {
        console.error("[CHAT_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const { chatId } = await params;
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { message } = await req.json();

        const companion = await prisma.companion.findUnique({
            where: { id: chatId },
        });

        if (!companion) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Get conversation history
        const previousMessages = await prisma.message.findMany({
            where: {
                companionId: chatId,
                userId: user.id,
            },
            orderBy: { createdAt: "asc" },
            take: 10, // Last 10 messages for context
        });

        // Save user message
        await prisma.message.create({
            data: {
                content: message,
                role: "user",
                companionId: chatId,
                userId: user.id,
            },
        });

        // Generate AI response using OpenAI
        const response = await generateChatResponse(
            companion.name,
            companion.description,
            companion.instructions,
            previousMessages.map((m) => ({ role: m.role, content: m.content })),
            message
        );

        // Save assistant message
        await prisma.message.create({
            data: {
                content: response,
                role: "assistant",
                companionId: chatId,
                userId: user.id,
            },
        });

        return NextResponse.json({ response });
    } catch (error) {
        console.error("[CHAT_POST]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
