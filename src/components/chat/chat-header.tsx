import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";

interface ChatHeaderProps {
    companion: {
        name: string;
        description: string;
        src: string;
    };
}

export const ChatHeader = ({ companion }: ChatHeaderProps) => {
    return (
        <div className="flex w-full items-center justify-between border-b border-white/10 bg-black/20 px-4 py-3 backdrop-blur-lg">
            <div className="flex items-center gap-2">
                <Link href="/" className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-3">
                    <Avatar src={companion.src} alt={companion.name} />
                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-white leading-none">
                            {companion.name}
                        </p>
                        <p className="text-xs text-gray-400 leading-none">
                            {companion.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
