import { Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Iconify } from "@/components/common"

const Select = ({ onChange, value, label, size = 'md', className = '', options = [], variant = 'input' }) => {
  const sizes = {
    sm: "rounded-xl px-3 py-2 h-8 gap-2 text-xs",
    md: "rounded-xl px-4 py-2 h-10 gap-2 text-sm",
    lg: "rounded-[28px] px-[29px] h-[52px] gap-2 text-md",
    xl: "",
    icon: ""
  }
  const sizeClasses = sizes[size] || ""

  const variants = {
    input: 'rounded-sm border border-dark-300 focus:border-primary-500 bg-dark-700',
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

  const listBoxVariants = {
    primary: "ring-1 ring-primary bg-primary",
    "primary-outline": "border border-primary/50",
    input: "border border-dark-300"
  }

  const listBoxVariantClasses = listBoxVariants[variant] || ""
  console.log(variant, listBoxVariantClasses)

  const handleChange = (event) => {
    onChange(event.value);
  }

  const getText = (value) => {
    const v = options.find(x => x.value === value)
    return v ? v.text : ''
  }

  return (
    <div className={`relative z-40 ${className}`}>
      { label && (<div className="mb-2 text-dark-200">{label}</div>) }
      <Listbox value={value} onChange={handleChange}>
        {({ open }) => (
          <>
            <Listbox.Button className={`relative w-full gap-2 flex items-center cursor-pointer ${variantClasses} ${sizeClasses} ${open ? 'rounded-b-none border-b-0' : ''}`}>
              <span className="block truncate text-left capitalize">{getText(value)}</span>
              <span className="pointer-events-none">
                <Iconify icon="mdi:menu-down" className={`${ open ? 'rotate-180' : ''}`} />
              </span>
            </Listbox.Button>

            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className={`${listBoxVariantClasses} ${open ? 'rounded-t-none': ''} absolute mt-0 max-h-60 w-full overflow-auto rounded-xl bg-dark-700 pt-2 pb-3 text-base shadow-lg focus:outline-none sm:text-sm`}>
                  {options.map((opt, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active }) =>
                        `relative select-none py-1 px-4 hover:text-primary cursor-pointer ${
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                      value={opt}
                    >
                        <>
                          <span
                            className={`block truncate ${
                              value === opt.value ? 'font-medium text-primary' : 'font-normal'
                            }`}
                          >
                            {opt.text}
                          </span>
                        </>

                    </Listbox.Option>
                  ))}
                </Listbox.Options>
            </Transition>
          </>
        )}

      </Listbox>
    </div>
  )
}

export default Select
