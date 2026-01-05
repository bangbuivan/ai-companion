import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, ...props }, ref) => {
        const [hasError, setHasError] = React.useState(false);

        const isDataUrl = src?.startsWith("data:");

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                    className
                )}
                {...props}
            >
                {src && !hasError && (isDataUrl || src.startsWith("http")) ? (
                    <Image
                        src={src}
                        alt={alt || "Avatar"}
                        fill
                        className="aspect-square h-full w-full object-cover"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {fallback || (alt ? alt.charAt(0).toUpperCase() : "A")}
                    </div>
                )}
            </div>
        );
    }
);
Avatar.displayName = "Avatar";

export { Avatar };
