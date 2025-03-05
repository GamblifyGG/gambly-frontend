import GameBox from '@/components/common/GameBox'

const Popular = () => {
  const games = Array(9).fill(0).map((x,i) => i)

  return (
    <div className="cont pb-36">
      <div className="text-center mb-20">
        <h3 className="text-4xl"><span className="text-primary">Popular</span> Casinos</h3>
        <p className="text-dark-200 mx-auto" style={{'maxWidth': '49em'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis</p>
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
