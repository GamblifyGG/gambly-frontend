import Link from 'next/link'
import classNames from 'classnames'
import { Iconify } from '@/components/common'
import { twMerge } from "tailwind-merge";

const NewButton = ({ className, children, href, busy = false, variant = "solid", size = "md", ...rest }) => {
  const variants = {
    solid: "bg-white/5 text-white hover:bg-white/10",
    ghost: "hover:bg-white/5",
    outline: "border-2 border-white/10 text-white hover:bg-white/10 active:hover:bg-white/20 hover:border-[transparent]",
    primary: "bg-gradient-to-b from-[#FFA843] to-[#E88E26] text-dark hover:bg-gradient-to-t data-[active=true]:bg-gradient-to-b",
    "primary-ghost": "text-white bg-primary/10 hover:bg-primary hover:text-dark data-[active=true]:bg-primary data-[active=true]:text-dark",
    "primary-outline": "border border-primary/50 text-[#F49B35] hover:text-dark hover:bg-[#F49B35] hover:border-[transparent] data-[active=true]:text-dark data-[active=true]:bg-[#F49B35] data-[active=true]:border-[transparent]",
    secondary: "bg-secondary text-white hover:bg-secondary-600 data-[active=true]:bg-secondary-600",
    "secondary-outline": "border border-secondary/50 text-secondary hover:text-white hover:bg-secondary hover:border-[transparent] data-[active=true]:text-white data-[active=true]:bg-secondary data-[active=true]:border-[transparent]",
  }
  const variantClasses = variants[variant] || ""

  const sizes = {
    sm: "rounded-xl px-3 py-2 h-8 gap-2 text-xs",
    md: "rounded-xl px-4 py-2 h-10 gap-2 text-sm",
    lg: "rounded-[28px] px-[29px] h-[52px] gap-2 text-md",
    xl: "",
    icon: "rounded-xl h-10 w-10 text-sm",
    "icon-sm": "rounded-xl h-8 w-8 text-sm",
    "icon-xs": "rounded-sm h-6 w-6 text-xs",
  }
  const sizeClasses = sizes[size] || ""

  const defaultClasses = `
    inline-flex items-center justify-center whitespace-nowrap
    font-medium ring-offset-background transition-colors
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
    ${variantClasses} ${sizeClasses}
  `;

  const mergedClasses = twMerge(defaultClasses, className);

  if (href) {
    return (
      <Link {...rest} href={href} className={mergedClasses}>
        { busy && <Iconify icon="zondicons:refresh" className="animate-spin inline-flex"/> }
        {children}
      </Link>
    );
  } else {
    return (
      <button {...rest} className={mergedClasses} data-variant={variant}>
        { busy && <Iconify icon="zondicons:refresh" className="animate-spin inline-flex"/> }
        {children}
      </button>
    );
  }
}

export default NewButton;
