import Head from "next/head";
import LoadingSmall from "@/components/LoadingSmall";
import { Iconify } from "@/components/common"

const CasinoLoader = ({ casinoError, casinoLoading }) => {
  if (casinoLoading) return (
    <LoadingSmall className="h-[300px]"/>
  )

  if (casinoError) return (
    <div className="relative p-4">
      <Head>
        <title>Casino Error! - Gambly</title>
      </Head>
      <div className="text-center p-10">
        <Iconify icon="mynaui:sad-ghost" className="text-3xl text-primary"/>
        <h1 className="text-2xl font-bold text-red">Casino Error!</h1>
        <p className="">{casinoError}</p>
      </div>
    </div>
  )

  return null
}

export default CasinoLoader;
