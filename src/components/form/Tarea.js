const Tarea = ({ label, size = 'md', ...rest }) => {
  const hasLabel = label != null

  const sizes = {
    'md': { height: '5.84rem', padding: '0 1rem' },
    'lg': { height: '12.5rem', padding: '0 1rem' }
  }

  const style = { ...sizes[size] }

  return (
    <div className="field mb-5">
      {hasLabel && (<div className="mb-2 text-dark-200">{label}</div>)}
      <textarea style={style} className="w-full rounded-sm border border-dark-260 bg-dark-700" {...rest} />
    </div>
  )
}

export default Tarea
