import React, { useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

const FormInput = React.forwardRef(({ 
  label,
  error,
  id,
  className,
  onEnterPress,
  onKeyDown,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onEnterPress) {
      e.preventDefault();
      onEnterPress();
      return;
    }
    onKeyDown?.(e);
  };

  return (
    <div className="custom-container">
      {label && (
        <label 
          htmlFor={id}
          className="flex items-center justify-between w-full text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <Input
        id={id}
        ref={ref}
        className={cn(
          "w-full px-3 py-2 transition-colors",
          "text-sm md:text-base",
          "border rounded-lg shadow-sm",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-200",
          className,
          "transition-all duration-200",
          isFocused && "ring-2 ring-primary/20",
          !error && props.value && "ring-2 ring-green-500/20",
          error && "ring-2 ring-red-500/20"
        )}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <p className="text-xs md:text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

export { FormInput };