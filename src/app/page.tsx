import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const companions = await prisma.companion.findMany({
    where: {
      userId: user.id,
    },
    include: {
      category: true,
      _count: {
        select: { messages: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">AI Companion</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Hello, {user.name || user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-white">Your Companions</h2>
          <Link
            href="/companion/new"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
          >
            + Create Companion
          </Link>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm">
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className="px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm transition"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Companions Grid */}
        {companions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No companions yet</p>
            <Link
              href="/companion/new"
              className="text-purple-400 hover:text-purple-300"
            >
              Create your first companion →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {companions.map((companion) => (
              <Link
                key={companion.id}
                href={`/chat/${companion.id}`}
                className="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                  {companion.src && companion.src.startsWith("data:") ? (
                    <Image
                      src={companion.src}
                      alt={companion.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{companion.src || "🤖"}</span>
                  )}
                </div>
                <h3 className="font-semibold text-white group-hover:text-purple-400 transition">
                  {companion.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {companion.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>{companion.category?.name}</span>
                  <span>•</span>
                  <span>{companion._count.messages} messages</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
