import Head from "next/head";

const PleaseLogin = ({ className }) => {
  return (
    <>
      <Head><title>Please Login - Gambly</title></Head>
      <div className={`flex justify-center items-center py-[100px] ${className}`}>
        <div className="flex flex-col items-center">
          <img src="/logo-letter.png" alt="G" className="block h-20 w-auto" />
          <div className="text-md font-bold">Please Connect Your Wallet To Continue...</div>
        </div>
      </div>
    </>
  )
}

export default PleaseLogin;
