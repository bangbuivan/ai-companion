import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const buttonVariants = ({
    variant = "default",
    size = "default",
    className,
}: {
    variant?: "default" | "secondary" | "ghost" | "destructive" | "outline" | "gradient";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
} = {}) => {
    return cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50",
        {
            "bg-white text-black hover:bg-white/90": variant === "default",
            "bg-white/10 text-white hover:bg-white/20": variant === "secondary",
            "hover:bg-white/10 text-white": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
            "border border-white/20 bg-transparent hover:bg-white/10 text-white": variant === "outline",
            "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700": variant === "gradient",
            "h-10 px-4 py-2": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-12 px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
        },
        className
    );
};

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "ghost" | "destructive" | "outline" | "gradient";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={buttonVariants({ variant, size, className })}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
