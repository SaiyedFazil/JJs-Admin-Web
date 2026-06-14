"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

interface NumericInputCellProps {
  value: number;
  onChange: (val: number) => void;
  error?: string;
  widthClass?: string;
}

export function NumericInputCell({
  value,
  onChange,
  error,
  widthClass = "w-24",
}: NumericInputCellProps) {
  const [inputValue, setInputValue] = React.useState<string>(String(value));

  // Sync state with value prop updates (e.g. parent form resets or edits)
  React.useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(raw);
    onChange(raw === "" ? 0 : Number(raw));
  };

  const handleBlur = () => {
    if (inputValue === "") {
      setInputValue("0");
      onChange(0);
    } else {
      setInputValue(String(Number(inputValue)));
    }
  };

  return (
    <TooltipProvider>
      <div className="relative flex items-center">
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "h-8 bg-white!",
            widthClass,
            error ? "border-red-500! pr-8 text-red-600! focus-visible:ring-red-500!" : ""
          )}
        />
        {error && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute right-2 flex cursor-pointer items-center justify-center rounded-full p-0.5 transition-colors hover:bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={6}
              className="border-none! bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
              side="top"
              align="center"
            >
              {error}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
