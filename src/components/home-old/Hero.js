import Button from '@/components/form/Button'
import { Icon, Stat } from '@/components/common/'

const Hero = () => {
  return (
    <div className="p-8">
      <div className="hero relative bg-cover rounded-lg flex flex-column justify-center items-center">
        <div className="text-center relative">
          <span className="uppercase mb-4 block">Lorem ipsum dolor sit amet consectEtur</span>
          <h1 className="text-5xl mb-6 text-white">Find And Join Your Community’s<span className="block text-primary">Personal Casino</span></h1>
          <p className="mb-9">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          <Button href="/casino">Browse Casinos</Button>
        </div>
      </div>

      <div className="hero-btm flex flex-col lg:flex-row lg:justify-center py-10 lg:py-16 gap-4 lg:gap-12">
        <Stat title="10,000+" text="Active Users">
          <Icon name="user" size="34px" />
        </Stat>

        <Stat title="24/7" text="Live Support">
          <Icon name="help" size="34px" />
        </Stat>

        <Stat title="$100,000,000+" text="Total Wagered">
          <Icon name="moneybag" size="34px" />
        </Stat>

        <Stat title="5,938+" text="Supported Tokens">
          <Icon name="money" size="34px" />
        </Stat>
      </div>
    </div>
  )
}
export default Hero