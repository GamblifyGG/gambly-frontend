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

  if (!isAuthenticated) {
    return (
      <main className={`${montserrat.className} bg-main min-h-screen flex items-center justify-center`}>
        <Head>
          <title>Welcome To Gambly!</title>
        </Head>
        <form onSubmit={handleLogin} className="bg-[#1E1E1E] p-12 rounded-2xl shadow-2xl border border-[#333333] w-[90%] max-w-[400px]">
          <h1 className="text-3xl mb-8 text-center font-bold text-white">Welcome to Gambly</h1>
          <div className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter password"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Enter Site
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className={`${montserrat.className} bg-main overflow-y-hidden`}>
      <Head>
        <title>Welcome To Gambly!</title>
      </Head>
      <AppContextProvider>
        <Header />
        <MobileMenu />
        <HeroSection />
        <MarqueeSection />
        <HowToPlaySection />
        <HowToPlayMdSection />
        <CrossSection />
        <PlaySection />
        <CasinosSection />
        <LiveSection />
        <FAQSection />
        <Footer />
      </AppContextProvider>
    </main>
  );
};

Home.getLayout = getLayout;

export default Home;
