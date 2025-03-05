import Button from '@/components/form/Button'
import { Icon, Stat } from '@/components/common/'
import { Transition } from '@headlessui/react'
import { useIsVisible } from '@/hooks'
import { useRef, useState, useContext } from 'react'
import { BaseContext } from '@/context/BaseContext'

const Hero = () => {
  const ref1 = useRef()
  const isVisible = useIsVisible(ref1)
  let [isShowing, setIsShowing] = useState(false)
  const { network } = useContext(BaseContext)


  return (
    <div ref={ref1} className="hero-cont cont" data-visible={isVisible}>

      <div className="p-px rounded-[9px] overflow-hidden relative bg-linear-primary">
        <div className={`absolute w-[3000px] h-[3000px] bg-conic-primary ${isVisible ? 'animate-spin-wave' : ''} anim-delay-1000 opacity-0 origin-center left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2`}></div>

        <div className="hero relative bg-cover rounded-[9px] flex flex-column justify-center items-center">
          <div className="text-center relative lg:min-h-[300px]">
            <Transition
              appear={true}
              show={true}
              enter="transform transition duration-[1000ms]"
              enterFrom="opacity-0 -translate-y-[100%]"
              enterTo="opacity-100 translate-y-[0]"
              leave="transform duration-200 transition ease-in-out"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <span className="uppercase mb-4  block">Welcome to Gambly</span>
            </Transition>

            <Transition
              appear={true}
              show={true}
              enter="transform transition duration-[1000ms] delay-100"
              enterFrom="opacity-0 translate-y-[100%]"
              enterTo="opacity-100 translate-y-[0]"
              leave="transform duration-200 transition ease-in-out"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <h1 className="text-2xl lg:text-5xl mb-6 text-white">Find And Join Your Community’s<span className="block text-primary">Personal Casino</span></h1>
            </Transition>

            <Transition
              appear={true}
              show={true}
              enter="transform transition duration-[1000ms] delay-200"
              enterFrom="opacity-0 translate-x-[100%]"
              enterTo="opacity-100 translate-x-[0]"
              leave="transform duration-200 transition ease-in-out"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <p className="mb-9">Gambly introduces a pioneering cross-chain casino platform, the first of its kind, where you can enjoy gaming with any ERC20 token. Discover the casino tailored for your community and embark on your gaming journey today.</p>
            </Transition>

            <Transition
              appear={true}
              show={true}
              enter="transform transition duration-[1000ms] delay-300"
              enterFrom="opacity-0 scale-0"
              enterTo="opacity-100 scale-1"
              leave="transform duration-200 transition ease-in-out"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Button href={`/casinos/ethereum`} className="drop-shadow-md">Browse Casinos</Button>
            </Transition>
          </div>
          <Button variant="primary-ol" className="absolute lg:flex hidden right-6 bottom-6 animate-bounce border-[2px]">
            <Icon name="trophy" className="relative"></Icon>
            <span>Claim Reward</span>
          </Button>
        </div>

      </div>


      <div className="hero-btm grid grid-cols-2 grid-rows-2 lg:flex flex-col lg:flex-row lg:justify-center py-10 lg:py-16 gap-4 lg:gap-12">
        <Transition
          appear={true}
          show={true}
          enter="transform transition duration-[1000ms]"
          enterFrom="opacity-0 translate-y-[100%]"
          enterTo="opacity-100 translate-y-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Stat title="10,000+" text="Active Users">
            <Icon name="user" size="34px" />
          </Stat>
        </Transition>

        <Transition
          appear={true}
          show={true}
          enter="transform transition duration-[1000ms] delay-100"
          enterFrom="opacity-0 translate-y-[100%]"
          enterTo="opacity-100 translate-y-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Stat title="24/7" text="Live Support">
            <Icon name="help" size="34px" />
          </Stat>
        </Transition>

        <Transition
          appear={true}
          show={true}
          enter="transform transition duration-[1000ms] delay-200"
          enterFrom="opacity-0 translate-y-[100%]"
          enterTo="opacity-100 translate-y-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Stat title="$100,000,000+" text="Total Wagered">
            <Icon name="moneybag" size="34px" />
          </Stat>
        </Transition>

        <Transition
          appear={true}
          show={true}
          enter="transform transition duration-[1000ms] delay-300"
          enterFrom="opacity-0 translate-y-[100%]"
          enterTo="opacity-100 translate-y-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Stat title="5,938+" text="Supported Tokens">
            <Icon name="money" size="34px" />
          </Stat>
        </Transition>
      </div>
    </div>
  )
}
export default Hero