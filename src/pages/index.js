"use client"

import { getLayout } from "@/components/DefaultLayout";
import CasinosSection from "@/components/home/casinos";
import ContactSection from "@/components/home/contact";
import CrossSection from "@/components/home/cross";
import FAQSection from "@/components/home/faq";
import HeroSection from "@/components/home/hero/index";
import HowToPlaySection from "@/components/home/how-to-play";
import HowToPlayMdSection from "@/components/home/how-to-play-md";
import LiveSection from "@/components/home/live";
import MarqueeSection from "@/components/home/marquee";
import PlaySection from "@/components/home/play";
import Head from "next/head";
// import tilt from 'vanilla-tilt'
import { Montserrat } from "next/font/google";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useState } from "react";
import { AppContextProvider } from "@/context/context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/menu";
import { useLayoutEffect } from "react";
const montserrat = Montserrat({ subsets: ["latin"] });

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const TEMP_PASSWORD = "gambly2024"; // You might want to store this more securely
  const [isLive, setIsLive] = useState(false);

  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === TEMP_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  // if (!isAuthenticated) {
  //   return (
  //     <main className={`${montserrat.className} bg-main min-h-screen flex items-center justify-center p-4`}>
  //       <Head>
  //         <title>Welcome To Gambly!</title>
  //       </Head>
  //       <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center">
  //         <div className="w-full md:w-1/2 text-white text-center md:text-left mb-6 md:mb-0">
  //           <img src="/logo-letter.png" alt="Gambly Logo" className="h-28 mx-auto md:mx-0 mb-4" />
            
  //           {/* New Platform Preview Section */}
  //           <div className="mb-8 relative group">
  //             <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
  //             <div className="relative rounded-xl bg-[#0d0d12] border border-[#ffffff10] p-2">
  //               <img 
  //                 src="/images/platform-preview.png" 
  //                 alt="Gambly Platform Preview" 
  //                 className="rounded-lg border border-[#ffffff10]"
  //               />
  //               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
  //                 <p className="text-sm text-gray-300">Example casino interface for $YOURTOKEN</p>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Updated Games Preview */}
  //           <div className="mb-8 p-4 rounded-xl bg-blue-900/30 border border-blue-500/30">
  //             <h3 className="text-xl font-bold text-blue-300 mb-4">Available Games for Your Token:</h3>
  //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //               <div className="bg-blue-800/30 p-3 rounded-lg group relative overflow-hidden">
  //                 <img 
  //                   src="/images/coinflip-demo.png" 
  //                   alt="Coinflip Game" 
  //                   className="rounded-md mb-2 border border-blue-500/30 transition-transform group-hover:scale-105"
  //                 />
  //                 <div className="px-2 pb-2">
  //                   <span className="block text-lg font-semibold text-white">Coinflip</span>
  //                   <span className="text-xs text-blue-200">50/50 instant betting</span>
  //                 </div>
  //               </div>
                
  //               <div className="bg-purple-800/30 p-3 rounded-lg group relative overflow-hidden">
  //                 <img 
  //                   src="/images/rps-demo.png" 
  //                   alt="Rock Paper Scissors" 
  //                   className="rounded-md mb-2 border border-purple-500/30 transition-transform group-hover:scale-105"
  //                 />
  //                 <div className="px-2 pb-2">
  //                   <span className="block text-lg font-semibold text-white">RPS</span>
  //                   <span className="text-xs text-purple-200">Classic hand game</span>
  //                 </div>
  //               </div>
                
  //               <div className="bg-pink-800/30 p-3 rounded-lg group relative overflow-hidden">
  //                 <img 
  //                   src="/images/poker-demo.png" 
  //                   alt="Poker Tables" 
  //                   className="rounded-md mb-2 border border-pink-500/30 transition-transform group-hover:scale-105"
  //                 />
  //                 <div className="px-2 pb-2">
  //                   <span className="block text-lg font-semibold text-white">Poker</span>
  //                   <span className="text-xs text-pink-200">Multiplayer tables</span>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Admin Panel Preview */}
            
  //           <div className="mb-8 rounded-xl bg-gradient-to-r from-purple-800/40 to-blue-800/40 p-6 border border-purple-500/30">
  //             <h2 className="text-xl font-semibold text-purple-300 mb-3">Create Your Own Casino For Your Token For Free!</h2>
  //             <p className="text-gray-300 mb-4">
  //               Gambly empowers any token to launch their own branded casino with popular games like Coinflip, Rock Paper Scissors, and Poker - all without technical knowledge!
  //             </p>
              
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
  //               <div className="flex items-center space-x-3">
  //                 <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
  //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  //                   </svg>
  //                 </div>
  //                 <span>Multi-chain support for any token</span>
  //               </div>
  //               <div className="flex items-center space-x-3">
  //                 <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
  //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  //                   </svg>
  //                 </div>
  //                 <span>Zero setup fees, launch in minutes</span>
  //               </div>
  //               <div className="flex items-center space-x-3">
  //                 <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
  //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  //                   </svg>
  //                 </div>
  //                 <span>Customizable branded games</span>
  //               </div>
  //               <div className="flex items-center space-x-3">
  //                 <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
  //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  //                   </svg>
  //                 </div>
  //                 <span>Provably fair gaming technology</span>
  //               </div>
  //             </div>
  //           </div>
            
  //           <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
  //             <a 
  //               href="https://t.me/gambly" 
  //               target="_blank" 
  //               rel="noopener noreferrer"
  //               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition"
  //             >
  //               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                 <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394a.759.759 0 0 1-.6.295.76.76 0 0 1-.551-.236l-.196-1.893 3.897-3.518c.169-.152-.037-.238-.258-.152l-4.818 3.03-2.07-.645c-.45-.137-.459-.45.101-.67l8.068-3.11c.368-.136.691.09.83.446l.197.281z" />
  //               </svg>
  //               Join our Telegram @gambly
  //             </a>
  //             <a 
  //               href="https://twitter.com/gamblyio" 
  //               target="_blank" 
  //               rel="noopener noreferrer"
  //               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
  //             >
  //               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                 <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  //               </svg>
  //               Follow @gamblyio
  //             </a>
  //           </div>
  //         </div>
  //         <div className="w-full md:w-1/2 max-w-[400px]">
  //           <form onSubmit={handleLogin} className="bg-[#1E1E1E] p-8 rounded-2xl shadow-2xl border border-[#333333] w-full">
  //             <h2 className="text-2xl mb-6 text-center font-bold text-white">Enter Password</h2>
  //             <div className="space-y-6">
  //               <input
  //                 type="password"
  //                 value={password}
  //                 onChange={(e) => setPassword(e.target.value)}
  //                 className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
  //                 placeholder="Enter password"
  //               />
  //               <button
  //                 type="submit"
  //                 className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
  //               >
  //                 Enter Site
  //               </button>
  //               <div className="text-gray-400 text-sm text-center">
  //                 <p className="mb-2">Contact us for access or join our Telegram for more information</p>
  //                 <p>Launching soon: Create your own token casino with Coinflip, Rock Paper Scissors, and Poker games!</p>
  //               </div>
  //             </div>
  //           </form>
  //           <div className="mt-6 bg-[#1E1E1E] p-4 rounded-xl border border-[#333333]">
  //             <p className="text-center text-sm text-purple-300">
  //               <span className="block font-bold text-base mb-1">Gambly — Create Your Own Casino For Free</span>
  //               Operated by Nextgen Virtual Gaming Group S.r.L
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main className={`${montserrat.className} bg-main overflow-y-hidden`}>
      <Head>
        <title>Welcome To Gambly!</title>
      </Head>
      <AppContextProvider>
        <Header isLive={isLive} />
        <MobileMenu isLive={isLive}  />
        <HeroSection isLive={isLive}  />
        <MarqueeSection isLive={isLive}  />
        <HowToPlaySection isLive={isLive}  />
        <HowToPlayMdSection isLive={isLive}  />
        <CrossSection isLive={isLive}  />
        <PlaySection isLive={isLive}  />
        <CasinosSection isLive={isLive}  />
        <LiveSection isLive={isLive}  />
        <FAQSection isLive={isLive}  />
        <Footer isLive={isLive}  />
      </AppContextProvider>
    </main>
  );
};

Home.getLayout = getLayout;

export default Home;
