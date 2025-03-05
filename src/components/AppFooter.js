import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { Iconify } from '@/components/common'

const Footer = ({ classNames }) => {
  const currentPath = usePathname() || '/'
  const router = useRouter()
  const links = [
    { text: 'Litepaper', href: 'https://gambly-litepaper.gitbook.io' },
    { text: 'Terms Of Service', href: 'https://gambly-litepaper.gitbook.io/untitled/info/terms-and-conditions' },
    { text: 'Privacy', href: 'https://gambly-litepaper.gitbook.io/untitled/info/privacy-policy' },
    { icon: 'mdi:discord', href: '#discord' },
    { icon: 'fa-brands:telegram-plane', href: '#telegram' },
  ]

  return (
    <div className={`px-4 pb-6 w-full ${classNames}`}>
      <footer className="rounded-2xl border border-dark-250 p-7 text-xs text-dark-350 hidden !w-full lg:grid grid-cols-[0.8fr_0.3fr]">
        <div className='text-xs'>
          <span>{process.env.NEXT_PUBLIC_WEBSITE_LINK} is a property of <span className='text-secondary'>{process.env.NEXT_PUBLIC_COMPANY_NAME}</span>, a Gaming company registered under the ID number <span className='text-secondary'>{process.env.NEXT_PUBLIC_COMPANY_NUMBER}</span> in {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}.</span>
        </div>
        <div className="_links flex gap-4 justify-end">
          {
            links.map(v => (
              <Link key={v.href} href={v.href} className={`hover:text-primary capitalize ${currentPath == v.href && 'text-primary'}`}>
                {v.icon ? (<Iconify icon={v.icon} className="_icon text-base"/>) : v.text}
              </Link>
            ))
          }
        </div>
      </footer>

      {/* Mobile footer */}
      {currentPath !== undefined &&
        <footer className="grid grid-cols-2 gap-6 text-dark-350 lg:hidden">
          <div className="rounded-2xl border border-dark-250 p-7 flex justify-evenly items-end">
            {
              links.filter(x => x.icon).map(v => (
                <Link key={v.href} href={v.href} className={`hover:text-primary capitalize ${currentPath == v.href && 'text-primary'}`}>
                  {v.icon ? (<Iconify icon={v.icon} className="_icon text-3xl" />) : v.text}
                </Link>
              ))
            }
          </div>
          <div>
            <div className="mb-2">
              {
                links.filter(x => x.text).map(v => (
                  <Link key={v.href} href={v.href} className={`hover:text-primary text-right capitalize block ${currentPath == v.href && 'text-primary'}`}>{v.icon ? (<Iconify icon={v.icon} className="_icon text-base" />) : v.text}</Link>
                ))
              }
            </div>
            <div className='text-right lg:text-left'>&copy;2024. All rights reserved</div>
          </div>
        </footer>
      }
    </div >
  )
}

export default Footer
