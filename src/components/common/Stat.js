import React from 'react';

const Stat = ({ title, text, children }) => {
  return (
    <div className="flex gap-3">
      <div className="rounded-lg border border-dark-250 p-4">
        {children}
      </div>
      
      <div className='flex justify-center flex-col'>
        <div className="text-primary text-2xl lg:text-3xl leading-none mb-2">{title}</div>
        <div className="text-sm">{text}</div>
      </div>
    </div>
  );
};

export default Stat
