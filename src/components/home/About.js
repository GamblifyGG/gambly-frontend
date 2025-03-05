import { useIsVisible } from '@/hooks'
import { useRef, useState } from 'react'
import ImageTicker from '@/components/common/ImageTicker'
import { Transition } from '@headlessui/react'

const About = () => {
  const ref1 = useRef()
  const isVisible = useIsVisible(ref1)

  const tickers = [
    '/ticker/1.png',
    '/ticker/2.png',
    '/ticker/3.png',
    '/ticker/4.png',
    '/ticker/5.png',
    '/ticker/6.png',
    '/ticker/7.png',
    '/ticker/9.png',
  ]

  return (
    <div ref={ref1} className="cont grid py-32 lg:grid-cols-2 gap-20 bg-dark-460 overflow-hidden lg:min-h-[607px]">
      <div className="relative">
        <div className="absolute z-10 inset-0 w-full h-1/4 bg-gradient-to-b from-dark-460"></div>
        <div className="absolute z-10 bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-dark-460"></div>
        <Transition
          appear={true}
          show={true}
          enter="transform transition duration-[800ms]"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="grid grid-cols-8">
            {tickers.map((x, i) => (
              <ImageTicker key={i} dir="y" invert={i % 2 === 0} aspect="85/391" className={`${i % 2 === 0 ? "" : "opacity-40"} animate-pulse`}>
                <img className="w-full h-auto" src={x} alt="" />
              </ImageTicker>
            ))}
          </div>
        </Transition>

      </div>
      <div className="space-y-7 flex flex-col justify-center">
        <Transition
          show={true}
          appear={true}
          enter="transform transition duration-[800ms]"
          enterFrom="opacity-0 translate-x-[100%]"
          enterTo="opacity-100 translate-x-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <h3 className="text-4xl" style={{ 'lineHeight': '137.5%' }}>Play with any <span className="text-primary">ERC20 Token</span></h3>
        </Transition>

        <Transition
          show={true}
          appear={true}
          enter="transform transition duration-[800ms]"
          enterFrom="opacity-0 translate-y-[100%]"
          enterTo="opacity-100 translate-y-[0]"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <p>At Gambly, we believe in giving our players the ultimate freedom in online gaming.</p>
          <p>That's why we've created a platform where any ERC20 token can be your ticket to exciting PVP games.</p><br></br>
          <p>Whether you're holding mainstream tokens or niche gems, your digital assets have a place in our gaming arena.</p>
        </Transition>
      </div>
    </div>
  )
}

export default About
