import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContactInputProps
    extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    as?: "input" | "textarea"
    rows?: number
    cols?: number
}

const ContactInput = React.forwardRef<
    HTMLInputElement | HTMLTextAreaElement,
    ContactInputProps
>(({ className, as = "input", type, ...props }, ref) => {
    const Comp = as === "textarea" ? "textarea" : "input"

    return (
        <Comp
            className={cn(
                "flex w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#6B7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6600] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all duration-300",
                as === "textarea" && "min-h-[120px] resize-y",
                className
            )}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={ref as any}
            type={as === "input" ? type : undefined}
            {...props}
        />
    )
})
ContactInput.displayName = "ContactInput"

export { ContactInput }
