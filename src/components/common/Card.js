const Card = ({ header, children, customClasses = '' }) => {
  return (
    <div className={`${customClasses} card rounded-xl overflow-hidden`}>
      <div className="px-5 py-4 flex items-center gap-3 font-bold text-white bg-gradient-to-r from-white/5 text-md">{header}</div>
      <div className="card-body p-5">
        {children}
      </div>
    </div>
  )
}

export default Card