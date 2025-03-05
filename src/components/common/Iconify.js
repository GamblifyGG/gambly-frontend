import { twMerge } from "tailwind-merge";

function Iconify({ icon, className = '', ...rest}) {
  const defaultClasses = "inline-flex mt-['0.125em']"
  const mergedClasses = twMerge(defaultClasses, className)
  return (
    <span className={mergedClasses} {...rest}><iconify-icon icon={icon} /></span>
  );
}

export default Iconify;