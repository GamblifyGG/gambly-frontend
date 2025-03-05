const AvatarStack = ({ pics = [], size = 40 }) => {
  const offset = Math.floor(size * 0.7) * -1

  return (
    <div className="flex">
      {
        pics.map((x,i) => (<img key={i} style={{'height': `${size}px`, 'marginLeft': `${i == 0 ? 0 : offset}px`}} className="relative rounded-full border-3 border-dark-250" src={x} alt=""/>))
      }
    </div>
  )
}

export default AvatarStack