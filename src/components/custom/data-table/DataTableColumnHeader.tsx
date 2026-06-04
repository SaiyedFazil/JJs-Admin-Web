import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div
      className={cn(
        "flex h-[38px] w-full cursor-pointer items-center select-none",
        className?.includes("justify-start")
          ? "justify-start"
          : "-mx-4 w-[calc(100%+2rem)] justify-center",
        className?.replace("justify-start", "").replace("justify-center", "")
      )}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="truncate">{title}</span>
      <span className="ml-2 flex shrink-0 items-center text-white">
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        )}
      </span>
    </div>
  );
}
