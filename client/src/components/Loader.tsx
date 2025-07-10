import React from 'react';

interface LoaderProps {
  size?: number; // size in px
}

const Loader: React.FC<LoaderProps> = ({ size = 48 }) => {
  const px = `${size}px`;
  return (
    <div className="flex items-center justify-center p-0">
      <div
        className="animate-spin rounded-full border-4 border-t-[#1980E5] border-b-[#1980E5] border-l-white border-r-white border-opacity-75"
        style={{ height: px, width: px }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
