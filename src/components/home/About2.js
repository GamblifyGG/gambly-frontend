import Button from '@/components/form/Button'
import { Transition } from '@headlessui/react'
import { useIsVisible } from '@/hooks'
import { useRef, useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faGamepad, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { BaseContext } from '@/context/BaseContext'

const About = () => {
  const ref1 = useRef()
  const isVisible = useIsVisible(ref1)
  let [isShowing, setIsShowing] = useState(false)
  const { network } = useContext(BaseContext)

  return (
    <div ref={ref1} className="cont py-32 grid lg:grid-cols-2 gap-16 lg:min-h-[638px]" data-visible={isVisible}>
      <div className="space-y-7">
        <Transition
          appear={true}
          show={true}
          enter="transform transition duration-[1000ms] delay-200"
          enterFrom="opacity-0 -translate-x-[100%]"
          enterTo="opacity-100 translate-x-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <h3 className="text-4xl" style={{ 'lineHeight': '137.5%' }}>Cross-Chain Compatibility Like Never Before</h3>
        </Transition>

        <Transition
          appear={true}
          show={true}
          enter="transform transition duration-[1000ms]"
          enterFrom="opacity-0 -translate-x-[100%]"
          enterTo="opacity-100 translate-x-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className='flex w-full justify-between px-10 mb-20'>
            <img src='/chains/eth.svg' alt="Ethereum" className="w-20 object-contain h-20 inline-block bg-darkgray p-4 rounded-md border-bordergray" />
            <img src='/chains/binance.svg' alt="BSC" className="w-20 object-contain h-20 inline-block bg-darkgray p-4 rounded-md border-bordergray" />
            <img src='/chains/polygon.svg' alt="Matic" className="w-20 object-contain h-20 inline-block bg-darkgray p-4 rounded-md border-bordergray" />
            <img src='/chains/avalanche.svg' alt="Avax" className="w-20 object-contain h-20 inline-block bg-darkgray p-4 rounded-md border-bordergray" />
            <div className='items-center justify-center flex backdrop-blur-xl relative'>
              <div className='absolute text-xs backdrop-blur-sm h-full flex items-center justify-center'>Coming soon</div>
              <img src='/chains/solana.svg' alt="Solana" className="w-20 object-contain h-20 inline-block bg-darkgray p-4 rounded-md border-bordergray" />
            </div>
          </div>
          <p>Gambly is available on Multiple blockchains, allowing you to play with any ERC20 token.
            Our platform is the first of its kind, offering a seamless gaming experience with any token of your choice.</p>


        </Transition>

        <div className="flex gap-4">
          <Transition
            appear={true}
            show={true}
            enter="transform transition duration-[1000ms]"
            enterFrom="opacity-0 scale-0"
            enterTo="opacity-100 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Button href={`/casinos/${network?.name}`}>
              <FontAwesomeIcon icon={faGamepad} className="mr-2" />
              Browse Casinos
            </Button>
          </Transition>

          <Transition
            appear={true}
            show={true}
            enter="transform transition duration-[1000ms] delay-150"
            enterFrom="opacity-0 scale-0"
            enterTo="opacity-100 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Button variant="primary-ol">
              <FontAwesomeIcon icon={faFile} className="mr-2" />
              Read the docs
            </Button>
          </Transition>
        </div>
      </div>
      <div>
        <Transition
          appear={true}
          show={true}
          enter="transform transition duration-[1000ms]"
          enterFrom="opacity-0 translate-x-[100%]"
          enterTo="opacity-100 translate-x-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <img className="w-full h-auto" src="/about2.png" alt="" />
        </Transition>
      </div>
    </div>
  )
}

export default About
