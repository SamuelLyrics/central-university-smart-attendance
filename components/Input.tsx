
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  IconComponent?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const Input: React.FC<InputProps> = ({ label, id, error, IconComponent, className, ...props }) => {
  const baseInputClasses = "block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue-light focus:border-transparent";
  const errorInputClasses = "border-red-500 focus:ring-red-500";

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {IconComponent && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconComponent className="h-5 w-5 text-gray-400" />
            </div>
        )}
        <input
          id={id}
          className={`${baseInputClasses} ${error ? errorInputClasses : ''} ${IconComponent ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
