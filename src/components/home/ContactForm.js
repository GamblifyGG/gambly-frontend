import { InfoBox, Icon } from '@/components/common'
import { Tarea, Tbox, Button } from '@/components/form'
import { Transition } from '@headlessui/react'
import { useIsVisible } from '@/hooks'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import SiteMap from './Sitemap'


const ContactForm = () => {
  const ref1 = useRef()
  const isVisible = useIsVisible(ref1)

  return (
    <div ref={ref1} className="cont pb-16">
      <div className="bg-dark-460 p-16 text-center">
        <SiteMap />
        <div className="flex justify-center gap-4 mt-4 mb-16">
          {/* <Icon name="mdi:discord" href="#discord" /> */}
          <FontAwesomeIcon icon={faTwitter} className='text-3xl hover:opacity-75' />
          <FontAwesomeIcon icon={faTelegram} className='text-3xl hover:opacity-75' />
          {/* <Icon name="fa-brands:twitter" href="#twitter" /> */}
        </div>
        
        <span>{process.env.NEXT_PUBLIC_WEBSITE_LINK} is a property of <span className='text-secondary'>{process.env.NEXT_PUBLIC_COMPANY_NAME}</span>, a Gaming company registered under the company number <span className='text-secondary'>{process.env.NEXT_PUBLIC_COMPANY_NUMBER}</span> in {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}.</span>
        <div className="text-xs mt-4">
          <span>Our services are intended for recreational use only. If you feel you have a gambling problem, please visit <a href="https://www.begambleaware.org/" className="text-primary">begambleaware.org</a></span>
          <span>or contact the National Gambling Helpline on <a href="tel:0808 8020 133" className="text-primary">0808 8020 133</a></span>
        </div>

        {/* gambling aware  */}

      </div>
    </div>
  )
}

export default ContactForm
