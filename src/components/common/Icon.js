import { useEffect, useState } from 'react'
import classNames from 'classnames'

const Icon = ({ name, attributes, className, size, onClick }) => {
  const [SvgIcon, setSvgIcon] = useState('')
  const defaultClass = 'svg-icon'
  const combinedClass = classNames(defaultClass, className)

  async function importIcon() {
    const svg = await import(`@/assets/${name}.svg`)
    setSvgIcon(() => svg.default)
  }

  useEffect(() => {
    importIcon()
  }, []);

  if (!SvgIcon) return null

  return (<SvgIcon onClick={onClick} {...attributes} style={{width: '1em', height: 'auto', fontSize: size || 'inherit' }} className={combinedClass} preserveAspectRatio="none"/>)
}

export default Icon;
