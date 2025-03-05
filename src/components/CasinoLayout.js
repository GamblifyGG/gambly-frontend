import Header from '@/components/AppHeader'
import Footer from '@/components/AppFooter'
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {

  const router = useRouter()


  // we dont want to show the footer on these routes
  const invalidFooterRoutes = [
    '/casinos/[network]/[token]/poker/[room]',
    '/casinos/[network]/[token]/poker',
    '/casinos/[network]/[token]/coinflip',
    '/casinos/[network]/[token]/rockpaperscissors',
    '/casinos/[network]/[token]/bank',
    '/casinos/[network]/[token]/burn',
    '/bank'
  ]


  const absoluteFooters = [
    '/casinos/[network]/[token]/poker',
  ]


  const excludedMainDiv = [
    '/bank',
    '/referrals',
    '/casinos/[network]/[token]/bank',
    '/casinos/[network]/[token]/poker',
    '/casinos/[network]/[token]/poker/[room]',
    '/casinos/[network]/[token]/coinflip',
    '/casinos/[network]/[token]/burn',
    '/casinos/[network]/[token]/bankroll',
    '/casinos/[network]/[token]/rockpaperscissors',
  ]

  useEffect(() => {
    console.log("router pathnanme", router.pathname)

    if (router.pathname === '/') {
      document.body.classList.add('home-layout')
      return () => {
        document.body.classList.remove('home-layout');
      }
    } else {
      document.body.classList.add('casino-layout')
    }
    return () => {
      document.body.classList.remove('casino-layout');
      document.body.classList.remove('home-layout');
    }
  }, [router.pathname])



  if (router.pathname === '/') {
    return (
      <>
        {/* <Header /> */}
        {children}
        {/* <Footer /> */}
      </>
    )
  } else {
    return (
      <>
        <Header />
        {router.pathname === '/casinos/[network]/[token]/poker/[room]' &&
          <div className='w-full h-[calc(100%-60px)] lg:h-[calc(100%)] grid grid-cols-1 grid-rows-[1fr]'>{children}</div>
        }
        {router.pathname === '/casinos/[network]/[token]/poker' &&
          <div className='w-full h-[calc(100%-60px)] lg:h-[calc(100%-100px)] grid grid-cols-1 grid-rows-[1fr]'>{children}</div>
        }
        {router.pathname === '/casinos/[network]/[token]/coinflip' &&
          <div className='w-full h-[calc(100%-160px)] lg:h-[calc(100%-100px)]'>{children}</div>
        }
        {router.pathname === '/casinos/[network]/[token]/rockpaperscissors' &&
          <div className='w-full h-full'>{children}</div>
        }
        {router.pathname === '/casinos/[network]/[token]/burn' &&
          <div className='w-full h-[calc(100%-160px)] lg:h-[calc(100%-100px)]'>{children}</div>
        }
        {router.pathname === '/casinos/[network]/[token]/bank' &&
          <div className='w-full h-full'>{children}</div>
        }
        {router.pathname === '/bank' &&
          <div className='w-full h-[calc(100%-160px)] lg:h-[calc(100%-120px)]'>{children}</div>
        }
        {router.pathname === '/referrals' &&
          <div className='w-full h-[calc(100%-160px)] lg:h-[calc(100%-120px)]'>{children}</div>
        }
        {router.pathname === '/casinos/[network]/[token]/bankroll' &&
          <div className='w-full h-[calc(100%-160px)] lg:h-[calc(100%-100px)]'>{children}</div>
        }


        {!excludedMainDiv.includes(router.pathname) &&
          <main className="flex-col flex">{children}</main>
        }


        {!invalidFooterRoutes.includes(router.pathname) && absoluteFooters.includes(router.pathname) &&
          <Footer classNames={'lg:relative absolute bottom-0'} />
        }

        {!invalidFooterRoutes.includes(router.pathname) && !absoluteFooters.includes(router.pathname) &&
          <Footer classNames={'lg:relative'} />
        }
      </>
    )
  }
}

export default Layout

export function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}