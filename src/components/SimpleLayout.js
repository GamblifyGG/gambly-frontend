import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/AppHeader"
import Footer from "@/components/AppFooter"
import { SparklesCore } from '@/components/ui/sparkles'
import LoginWindow from "@/components/loginwindow/LoginWindow";

const Layout = ({ children }) => {
  const router = useRouter()
  const [showSparkle, setShowSparkle] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  const sparklePaths = [
    "/casinos/[network]",
    "/casinos/[network]/[token]/burn",
  ]

  const noFooterPaths = [
    "/casinos/[network]/[token]/poker/[room]",
    "/casinos/[network]/[token]/poker2/[room]"
  ]

  useEffect(() => {
    setShowSparkle(sparklePaths.some(x => x === router.pathname))
    setShowFooter(!noFooterPaths.some(x => x === router.pathname))

    if (router.pathname !== "/") {
      document.body.classList.add("pt-[60px]", "lg:pt-[80px]", "lg:pl-[80px]")
    } else {
      document.body.classList.remove("pt-[60px]", "lg:pt-[80px]")
    }
  }, [router.pathname])

  if (router.pathname === "/") {
    return (
      <>
        {children}
      </>
    )
  } 

  return (
    <>
      <Header />
      <main data-layout="simple" className={`${showFooter ? 'min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-186px)] p-4' : ''} relative`}>
        <div className={`h-full w-full left-0 top-0 absolute z-0 pointer-events-none  transition-all duration-300 ${showSparkle ? 'opacity-100' : 'opacity-0'}`}>
          <SparklesCore particleColor={'#FFA843'} particleDensity={10} id={'test'} className="h-full w-full" background={'red'} />
        </div>
        {children}
      </main>
      { showFooter && <Footer /> }
      <LoginWindow />
    </>
  )
}

export default Layout

export function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
