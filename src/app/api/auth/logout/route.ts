import { destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST() {
    try {
        await destroySession();
        // Redirect to login page after logout
    } catch (error) {
        console.error("[LOGOUT]", error);
    }
    redirect("/login");
}
