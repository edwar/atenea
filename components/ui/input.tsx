import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-8 w-full rounded-lg border border-[#1E293B] bg-[#0A0E17] px-3 py-2 text-sm text-[#F8FAFC] transition-colors outline-none placeholder:text-[#64748B] focus-visible:border-[#475569] focus-visible:ring-1 focus-visible:ring-[#475569] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
