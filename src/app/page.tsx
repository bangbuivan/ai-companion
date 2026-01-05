import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Companions } from "@/components/companions";

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
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Companions data={companions} categories={categories} />
      </main>
    </div>
  );
}

