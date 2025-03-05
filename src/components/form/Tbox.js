const Tbox = ({ label, size = 'md', value, onChange, ...rest }) => {
  const hasLabel = label != null

  const sizes = {
    'md': { height: '2.92rem', padding: '0 1rem' },
    'lg': { height: '2.92rem', padding: '0 1rem' }
  }

  const style = { ...sizes[size] }

  const handleChange = (event) => {
    onChange(event.target.value);
  }

  return (
    <div className="field mb-5">
      {hasLabel && (<div className="mb-2 text-dark-200">{label}</div>)}
      <input
        style={style}
        className="w-full rounded-sm border border-dark-260 focus:border-primary-500 bg-dark-700 disabled:opacity-50"
        value={value}
        onChange={handleChange}  
        {...rest} 
      />
    </div>
  )
}

export default Tbox
