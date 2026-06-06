"use client";

import { CloudUpload, FileText, X } from "lucide-react";
import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import Image from "next/image";
import type { DropEvent, DropzoneOptions, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DropzoneContextType = {
  src?: File[];
  accept?: DropzoneOptions["accept"];
  maxSize?: DropzoneOptions["maxSize"];
  minSize?: DropzoneOptions["minSize"];
  maxFiles?: DropzoneOptions["maxFiles"];
  onRemove?: (file: File) => void;
};

const renderBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const getAcceptedTypesLabel = (accept?: DropzoneOptions["accept"]) => {
  if (!accept) return "Files";

  // Check if accept is array or object
  const types = Array.isArray(accept) ? accept : Object.keys(accept);

  const labels: string[] = [];

  if (types.some((t) => t.includes("pdf"))) labels.push("PDF");
  if (types.some((t) => t.includes("word") || t.includes("document") || t.includes("msword")))
    labels.push("DOCX");
  if (types.some((t) => t.includes("image"))) labels.push("Image");
  if (types.some((t) => t.includes("video"))) labels.push("Video");
  if (types.some((t) => t.includes("audio"))) labels.push("Audio");

  if (labels.length === 0) return "Supported files";

  if (labels.length === 1) return labels[0];

  // Join with commas and add 'and' before the last item
  const last = labels.pop();
  return `${labels.join(", ")} and ${last}`;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined);

export type DropzoneProps = Omit<DropzoneOptions, "onDrop"> & {
  src?: File[];
  className?: string;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void;
  onRemove?: (file: File) => void;
  children?: ReactNode;
};

export const Dropzone = ({
  accept,
  maxFiles = 1,
  maxSize,
  minSize,
  onDrop,
  onError,
  disabled,
  src,
  onRemove,
  className,
  children,
  contentClassName,
  ...props
}: DropzoneProps & { contentClassName?: string }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onError,
    disabled,
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const error = rejection.errors[0];
        let message = error.message;

        if (error.code === "file-too-large" && maxSize) {
          message = `File is too large. Max size is ${renderBytes(maxSize)}`;
        } else if (error.code === "file-invalid-type") {
          const typesLabel = getAcceptedTypesLabel(accept);
          message = `Invalid file type. Only ${typesLabel} are allowed.`;
        }

        onError?.(new Error(message));
        return;
      }

      onDrop?.(acceptedFiles, fileRejections, event);
    },
    ...props,
  });

  return (
    <DropzoneContext.Provider
      key={JSON.stringify(src)}
      value={{ src, accept, maxSize, minSize, maxFiles, onRemove }}
    >
      <div
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300",
          isDragActive
            ? "scale-[1.01] border-(--theme-taupe-400) bg-(--theme-taupe-50)"
            : "border-(--theme-coffee-200) bg-(--theme-coffee-50)/30 hover:border-(--theme-coffee-400) hover:bg-(--theme-coffee-50)/60",
          disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
          (!src || src.length === 0) && "cursor-pointer",
          className
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} disabled={disabled} />
        <div
          className={cn(
            "flex flex-col items-center justify-center px-8 py-4 text-center",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </DropzoneContext.Provider>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }

  return context;
};

function ImageThumbnail({ file }: { file: File }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Free memory when this component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!preview) return null;

  return (
    <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl border border-(--theme-coffee-200) bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
      <Image
        src={preview}
        alt={file.name}
        width={176}
        height={176}
        unoptimized
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

export type DropzoneContentProps = {
  children?: ReactNode;
  className?: string;
};

export const DropzoneContent = ({ children, className }: DropzoneContentProps) => {
  const { src, onRemove } = useDropzoneContext();

  if (!src || src.length === 0) {
    return null;
  }

  if (children) {
    return children;
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {src.map((file, index) => (
        <div
          key={index}
          onClick={(e) => e.stopPropagation()} // Prevent opening file dialog when clicking on file card
          className="relative flex w-full flex-col items-center justify-center rounded-2xl border border-(--theme-coffee-100) bg-white px-6 py-4 text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          {file.type.startsWith("image/") ? (
            <ImageThumbnail file={file} />
          ) : (
            <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl border border-(--theme-coffee-200) bg-(--theme-coffee-50) shadow-inner">
              <FileText className="h-20 w-20 text-(--theme-coffee-400)" />
            </div>
          )}

          <div className="mt-4 flex w-full flex-col items-center gap-2 overflow-hidden text-center">
            <p className="w-full max-w-[280px] truncate text-sm font-bold text-(--theme-burgundy-950)">
              {file.name}
            </p>
            <span className="rounded-full border border-(--theme-coffee-100) bg-(--theme-coffee-50) px-2.5 py-0.5 text-xs font-semibold text-(--theme-coffee-500)">
              {renderBytes(file.size)}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-3.5 right-3.5 h-8 w-8 cursor-pointer rounded-lg p-0 text-red-400 opacity-80 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(file);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* Change File Button */}
      <Button
        type="button"
        variant="outline"
        className="mt-3 h-9 cursor-pointer self-center rounded-xl border border-(--theme-coffee-200) bg-white px-4 text-xs font-semibold text-(--theme-burgundy-700) shadow-xs transition-all duration-200 hover:border-(--theme-burgundy-200) hover:bg-(--theme-burgundy-50) hover:text-(--theme-burgundy-800)"
      >
        Replace File
      </Button>
    </div>
  );
};

export type DropzoneEmptyStateProps = {
  children?: ReactNode;
  className?: string;
};

export const DropzoneEmptyState = ({ children, className }: DropzoneEmptyStateProps) => {
  const { src, accept, maxSize } = useDropzoneContext();

  if (src && src.length > 0) {
    return null;
  }

  if (children) {
    return children;
  }

  const getSizeLabel = () => {
    if (!maxSize) return "";
    return `(Max ${renderBytes(maxSize)})`;
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--theme-coffee-100) transition-transform duration-300 group-hover:scale-110">
        <CloudUpload className="h-6 w-6 text-(--theme-coffee-600)" />
      </div>
      <div className="mt-2 space-y-1">
        <p className="xs:text-base text-sm font-semibold text-(--theme-burgundy-700)">
          <span className="text-(--theme-taupe-600) hover:underline">Click to upload</span> or drag
          and drop
        </p>
        <p className="xs:text-sm text-xs text-(--theme-coffee-500)">
          {getAcceptedTypesLabel(accept)} {getSizeLabel()}
        </p>
      </div>
    </div>
  );
};
