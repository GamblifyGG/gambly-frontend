import classNames from 'classnames'

const ImageTicker = ({ aspect, children, className, invert = false, dir = 'x'}) => {
  let anim = dir === 'x' && !invert ? 'animate-xticker' :
             dir === 'x' && invert ? 'animate-xticker-inv' :
             dir === 'y' && !invert ? 'animate-yticker' :
             dir === 'y' && invert ? 'animate-yticker-inv' : ''

  const classes = classNames(`overflow-hidden w-full`, className)

  return (
    <div className={classes} style={{aspectRatio: aspect }}>
      <div className={`w-full ${anim} ${dir === "x" ? "flex-1-children" : ""}`}>
        {children}
        {children}
      </div>
    </div>
  )
}

export default ImageTicker