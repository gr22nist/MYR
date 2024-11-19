import React from "react";
import { useIMEInput } from "@/hooks/useIMEInput";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  value: externalValue,
  onChange: externalOnChange,
  ...props 
}, ref) => {
  const {
    value,
    onChange,
    onCompositionStart,
    onCompositionEnd
  } = useIMEInput(externalValue, externalOnChange);

  return (
    <input
      type={type}
      className={cn(
        // 기본 레이아웃
        "flex w-full",
        "h-9 md:h-10",
        "px-3 py-1 md:py-2",
        
        // 텍스트 스타일
        "text-sm md:text-base",
        "placeholder:text-gray-500",
        
        // 테두리와 배경
        "rounded-md",
        "border border-input",
        "bg-background",
        "shadow-sm",
        
        // 상태 스타일
        "transition-all duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "focus-visible:border-transparent",
        
        // 파일 입력 스타일
        "file:border-0",
        "file:bg-transparent",
        "file:text-sm",
        "file:font-medium",
        
        // 비활성화 상태
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        
        // 다크모드
        // "dark:border-gray-800",
        // "dark:bg-gray-950",
        // "dark:placeholder:text-gray-400",
        
        className
      )}
      ref={ref}
      value={value}
      onChange={onChange}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };