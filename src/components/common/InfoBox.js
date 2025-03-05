import React from 'react';

const Stat = ({ title, text1, text2, children }) => {
  return (
    <div className="flex gap-6">
      <div className="rounded-lg border border-dark-260 text-2xl w-14 h-14 flex items-center justify-center bg-dark-700">
        {children}
      </div>
      
      <div className="space-y-1.5 lh-p">
        <div className="text-primary">{title}</div>
        <div className="text-sm text-dark-200">{text1}</div>
        <div className="text-sm">{text2}</div>
      </div>
    </div>
  );
};

export default Stat
