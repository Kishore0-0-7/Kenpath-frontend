import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#286B55] text-white",
        secondary:
          "border-[#D1E3D6] bg-[#EAF2EC] text-[#286B55]",
        destructive:
          "border-transparent bg-[#BB754C] text-white",
        outline:
          "border-[#E5E9E3] text-[#5F6B64] bg-white",
        optimal:
          "border-[#D1E3D6] bg-[#EAF2EC] text-[#286B55]",
        elevated:
          "border-[#FBE3B8] bg-[#FEF6E9] text-[#A46714]",
        high:
          "border-[#F3CFBF] bg-[#FBECE6] text-[#BB754C]",
        low:
          "border-[#F2D0C4] bg-[#FBECE6] text-[#A64B2A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
