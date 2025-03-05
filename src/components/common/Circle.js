import Icon from './Icon'

const Circle = ({ children, variant = 'dark', size = '30px', icon }) => {
  const variants = {
    primary: 'grad-primary',
    secondary: 'grad-secondary-v',
    purp: 'grad-purp',
    dark: 'grad-dark'
  }

  const _variant = variants[variant]

  return (
    <div className={`rounded-full flex items-center justify-center ${_variant}`} style={{width: '1em', height: '1em', fontSize: size}}>
      { icon && <Icon name={icon} style={{fontSize: '0.5em'}}/> }
      { children }
    </div>
  )
}

export default Circle