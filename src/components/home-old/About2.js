import Button from '@/components/form/Button'

const About = () => {
  return (
    <div className="cont py-32 grid lg:grid-cols-2 gap-16">
      <div className="space-y-7">
        <h3 className="text-4xl" style={{'lineHeight': '137.5%'}}>Lorem ipsum dolor sit amet, consect etur adipiscing ipsum dolor</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <div className="flex gap-4">
          <Button>Call To Action</Button>
          <Button variant="primary-ol">Secondary Call</Button>
        </div>
      </div>
      <div>
        <img className="w-full h-auto" src="/about2.png" alt="" />
      </div>
    </div>
  )
}

export default About
