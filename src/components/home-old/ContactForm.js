import { InfoBox, Icon } from '@/components/common'
import { Tarea, Tbox, Button } from '@/components/form'


const ContactForm = () => {
  return (
    <div className="cont pb-16">
      <div className="bg-dark-460 rounded-2xl p-6 lg:p-24 grid lg:grid-cols-2 gap-16">
        <div>
          <Tbox label="Name" type="text" placeholder=""/>
          <Tbox label="Email" type="text" placeholder=""/>
          <Tarea label="Your Message" type="text" placeholder="" size="lg"/>
          <Button>Send Message</Button>
        </div>
        <div>
          <h3 className="text-4xl">Contact</h3>
          <p className="mb-14 text-dark-200">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-12">
            <div>
              <InfoBox
                title="Chat With Us"
                text1="Lorem ipsum dolor sit amet:"
                text2="contact@gambling.com"
              >
                <Icon name="user" size="1.5rem" />
              </InfoBox>
            </div>
            <div>
              <InfoBox
                title="Call Us"
                text1="Lorem ipsum dolor sit amet elit:"
                text2="+123 456-789"
              >
                <Icon name="phone" size="1.3rem" />
              </InfoBox>
            </div>
            <div>
              <InfoBox
                title="Visit Us"
                text1="Lorem ipsum dolor sit consectetur:"
                text2="100 Smith Street Collingwood"
              >
                <Icon name="pin" size="1.3rem" />
              </InfoBox>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ContactForm
