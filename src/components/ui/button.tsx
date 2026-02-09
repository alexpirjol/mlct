import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow,border-color] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 uppercase tracking-wider cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-transparent border-2 border-foreground text-foreground hover:border-accent hover:text-accent',
        destructive:
          'bg-transparent border-2 border-destructive text-destructive hover:bg-destructive/10',
        outline: 'border-2 border-foreground bg-transparent hover:border-accent hover:text-accent',
        secondary:
          'bg-transparent border-2 border-secondary text-secondary hover:border-accent hover:text-accent',
        ghost: 'bg-transparent hover:text-accent',
        link: 'text-foreground no-underline hover:text-accent hover:no-underline',
      },
      size: {
        clear: '',
        default: 'h-12 px-6 py-3 has-[>svg]:px-4',
        sm: 'h-10 rounded-md px-4 has-[>svg]:px-3',
        lg: 'h-14 rounded-md px-10 has-[>svg]:px-6',
        icon: 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
