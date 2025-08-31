import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-light shadow-medium hover:shadow-large",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-medium",
        outline: "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground shadow-subtle hover:shadow-medium",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-subtle hover:shadow-medium",
        ghost: "hover:bg-accent/10 hover:text-accent text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-light",
        hero: "gradient-automotive text-white font-bold shadow-accent hover:shadow-large hover:scale-105 transition-smooth",
        accent: "bg-accent text-accent-foreground hover:bg-accent-light shadow-accent hover:shadow-large",
        premium: "gradient-primary text-white font-bold shadow-automotive hover:shadow-large hover:scale-[1.02] transition-smooth",
        automotive: "bg-automotive-red text-white hover:bg-automotive-red-dark shadow-medium hover:shadow-large font-bold"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-lg",
        xl: "h-16 rounded-2xl px-12 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
