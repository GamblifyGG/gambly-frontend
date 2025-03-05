import { Icon } from '@/components/common'

const CoinHead = ({ side = 'heads', size = 'md', className, showTitle = false }) => {
  const sizes = {
    sm: 'text-[30px]',
    md: 'text-[40px]',
    lg: 'text-[80px]',
    xl: 'text-[120px]',
  }

  return (
    <div className={`w-[1em] h-[1em] items-center inline-flex flex-col gap-2 ${className || ''} ${size ? sizes[size] : ''}`}>
      <Icon name={side} />
      { showTitle && <span className="text-xs uppercase">{side}</span> }
    </div>
  )
}

export default CoinHead