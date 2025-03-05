import GameBox from '@/components/common/GameBox'
import { Transition } from '@headlessui/react'
import { useIsVisible } from '@/hooks'
import { useRef, useState } from 'react'

const Popular = () => {
  const games = Array(9).fill(0).map((x, i) => i)
  const ref1 = useRef()
  const isVisible = useIsVisible(ref1)
  let [isShowing, setIsShowing] = useState(false)

  return (
    <div ref={ref1} className="cont pb-36 lg:flex flex-col hidden" data-visible={true}>
      <div className="text-center mb-20">
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
          <h3 className="text-4xl"><span className="text-primary">Popular</span> Casinos</h3>
        </Transition>
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
          <p className="text-dark-200 mx-auto" style={{ 'maxWidth': '49em' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis</p>
        </Transition>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-7">
        {
          games.map((x) => (<GameBox key={x} />))
        }
      </div>
    </div>
  )
}

export default Popular
