import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
    sm: "size-4",
    default: "size-5",
    lg: "size-8",
} as const;

type LoaderProps = {
    size?: keyof typeof sizes;
    label?: string;
    className?: string;
};

export function Loader({ size = "default", label, className }: LoaderProps) {
    return (
        <span
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2"
        >
            <Loader2
                className={cn("animate-spin text-[#a17943]", sizes[size], className)}
            />
            {label && <span className="text-xs text-[#888980]">{label}</span>}
            <span className="sr-only">{label ?? "Loading"}</span>
        </span>
    );
}

export function FullPageLoader({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
            <Loader size="lg" label={label} />
        </div>
    );
}
