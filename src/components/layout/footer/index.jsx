import Link from "next/link";
import Logo from "@/components/basic/logo";
import Iconify from "@/components/common/Iconify"

export default function Footer() {
  return (
    <footer className="bg-main flex p-4 justify-center px-6 lg:px-24">
      <div className="max-w-container w-full flex flex-col items-center gap-20">
        <div className="flex justify-between w-full flex-col gap-5 md:flex-row md:gap-3">
          <SocialSection />
          <div className="bg-placeHolder h-full flex-1 max-w-[1px]" />
          <CompanyLinks />
          <SupportLinks />
          <ProductLinks />
        </div>
        <p className="text-white text-left md:text-center">
          Gambly.io is a property of{" "}
          <span className="text-primary">
            Nextgen Virtual Gaming Group S.R.L
          </span>
          , a Gaming company registered under the ID number{" "}
          <span className="text-primary">3-102-900646</span> in Costa Rica.
        </p>
      </div>
    </footer>
  );
}

const SocialSection = () => {
  return (
    <section className="flex flex-col gap-5 ">
      <Logo />
      <div className="flex items-center gap-3">
        <a href="https://x.com/gambly_io">
          <Iconify icon="prime:twitter" className="inline-flex hover:text-primary text-[18px]" />
        </a>
        <a href="https://discord.gg/xvVcxM8F4p">
          <Iconify icon="prime:discord" className="inline-flex hover:text-primary text-[30px]" />
        </a>
        <a href="https://t.me/gambly_io">
          <Iconify icon="prime:telegram" className="inline-flex hover:text-primary text-[30px]" />
        </a>
      </div>
      <p className="text-placeHolder">Gambly © 2024. All rights reserved</p>
    </section>
  );
};

const CompanyLinks = () => {
  return (
    <section className="flex flex-col">
      <h4 className="font-semibold mb-3 text-white">About Us</h4>
      <ul className="text-placeHolder">
        <li><Link className="hover:text-primary" href="https://gambly-litepaper.gitbook.io" target="_blank">Litepaper</Link></li>
        <li><Link className="hover:text-primary" href="https://gambly-litepaper.gitbook.io/untitled/info/tokenomics">Tokenomics</Link></li>
      </ul>
    </section>
  );
};

const SupportLinks = () => {
  return (
    <section className="flex flex-col">
      <h4 className="font-semibold mb-3 text-white">Support</h4>
      <ul className="text-placeHolder">
        <li><Link className="hover:text-primary" href="https://gambly-litepaper.gitbook.io/untitled/info/terms-and-conditions">Terms and Conditions</Link></li>
        <li><Link className="hover:text-primary" href="https://gambly-litepaper.gitbook.io/untitled/info/responsible-gambling">Responsible Gambling</Link></li>
        <li><Link className="hover:text-primary" href="https://gambly-litepaper.gitbook.io/untitled/info/privacy-policy">Privacy Policy</Link></li>
      </ul>
    </section>
  );
};

const ProductLinks = () => {
  return (
    <section className="flex flex-col">
      <h4 className="font-semibold mb-3 text-white">Networks</h4>
      <ul className="text-placeHolder">
        {/* <li><Link className="hover:text-primary" href="/casinos/ethereum">Ethereum</Link></li> */}
        <li><Link className="hover:text-primary" href="/casinos/bsc">Binance Smart Chain</Link></li>
        <li><Link className="hover:text-primary" href="/casinos/solana">Solana</Link></li>
      </ul>
    </section>
  );
};
