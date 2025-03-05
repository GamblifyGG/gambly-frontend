const About = () => {
  return (
    <div className="cont py-32 grid lg:grid-cols-2 gap-16 bg-dark-460">
      <div className="">
        <img className="w-full h-auto" src="/about.png" alt="" />
      </div>
      <div className="space-y-7 flex flex-col justify-center">
        <h3 className="text-4xl" style={{'lineHeight': '137.5%'}}>Lorem ipsum dolor sit amet consec tetur adipiscing lorem lor</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</p>
      </div>
    </div>
  )
}

export default About
