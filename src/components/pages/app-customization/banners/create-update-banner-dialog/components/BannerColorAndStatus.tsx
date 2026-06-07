"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerEyeDropper,
} from "@/components/ui/color-picker";
import Color from "color";

interface BannerColorAndStatusProps {
  textColorValue: string;
  setTextColorValue: (value: string) => void;
  textColorError?: string;
  textColorTouched?: boolean;
  setFieldTouched: (field: string, isTouched: boolean, shouldValidate?: boolean) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  isActiveValue: boolean;
  setIsActiveValue: (value: boolean) => void;
  isSubmitting: boolean;
}

export function BannerColorAndStatus({
  textColorValue,
  setTextColorValue,
  textColorError,
  textColorTouched,
  setFieldTouched,
  handleBlur,
  isActiveValue,
  setIsActiveValue,
  isSubmitting,
}: BannerColorAndStatusProps) {
  return (
    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
      {/* Text Color Accent */}
      <div className="space-y-1.5">
        <Label htmlFor="textColor" className="text-sm font-semibold text-(--theme-burgundy-950)">
          Text Accent Color <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="textColor"
            name="text_color"
            type="text"
            placeholder="#FFFFFF"
            value={textColorValue}
            onChange={(e) => {
              const val = e.target.value;
              setTextColorValue(val);
              // Automatically convert value to uppercase if it's a valid hex length
              if (val.startsWith("#") && val.length === 7) {
                setTextColorValue(val.toUpperCase());
              }
            }}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`h-11 flex-1 rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) placeholder:text-(--theme-coffee-300) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
              textColorTouched && textColorError ? "border-red-500 focus:border-red-500" : ""
            }`}
          />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={isSubmitting}
                className="h-11 w-14 cursor-pointer rounded-xl border border-(--theme-burgundy-200) bg-white p-1 shadow-sm transition-all duration-200 hover:bg-(--theme-coffee-50)/30 focus:outline-hidden"
                title="Choose Accent Color"
              >
                <div
                  className="h-full w-full rounded-lg border border-black/10"
                  style={{
                    backgroundColor:
                      textColorValue &&
                      textColorValue.startsWith("#") &&
                      textColorValue.length === 7
                        ? textColorValue
                        : "#FFFFFF",
                  }}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 rounded-2xl border border-(--theme-burgundy-100) bg-white p-3 shadow-xl"
              align="end"
            >
              <ColorPicker
                value={
                  textColorValue && textColorValue.startsWith("#") && textColorValue.length === 7
                    ? textColorValue
                    : "#FFFFFF"
                }
                onChange={(rgba) => {
                  try {
                    const [r, g, b] = rgba as unknown as [number, number, number];
                    const hex = Color.rgb(r, g, b).hex().toUpperCase();
                    setTextColorValue(hex);
                    setFieldTouched("text_color", true, false);
                  } catch {
                    // Ignore invalid values
                  }
                }}
                className="space-y-3"
              >
                <ColorPickerSelection className="h-32 rounded-lg" />
                <ColorPickerHue className="h-4" />
                <div className="flex items-center gap-2">
                  <ColorPickerEyeDropper className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--theme-burgundy-100) hover:bg-neutral-100" />
                  <div className="flex-1 rounded-lg border border-(--theme-burgundy-100)/50 bg-(--theme-coffee-50)/30 py-1.5 text-center text-xs font-semibold text-(--theme-burgundy-950)">
                    {textColorValue || "#FFFFFF"}
                  </div>
                </div>
              </ColorPicker>
            </PopoverContent>
          </Popover>
        </div>
        {textColorTouched && textColorError && (
          <p className="text-xs font-medium text-red-500">{textColorError}</p>
        )}
      </div>

      {/* Status Switch */}
      <div className="flex h-11 items-center justify-between rounded-xl border border-(--theme-burgundy-100)/50 bg-(--theme-coffee-50)/10 px-4">
        <span className="text-sm font-semibold text-(--theme-burgundy-950)">Status</span>
        <div className="flex items-center gap-2.5">
          <span
            className={`text-xs font-bold ${isActiveValue ? "text-green-600" : "text-amber-600"}`}
          >
            {isActiveValue ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={isActiveValue}
            onCheckedChange={(checked) => {
              setIsActiveValue(checked);
              setFieldTouched("is_active", true, false);
            }}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
