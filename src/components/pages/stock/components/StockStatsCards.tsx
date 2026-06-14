"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ClipboardList, Layers, Ban } from "lucide-react";

interface StockStatsCardsProps {
  stats: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
}

export function StockStatsCards({ stats }: StockStatsCardsProps) {
  const cardsConfig = [
    {
      label: "Total Products",
      value: stats.total,
      icon: ClipboardList,
      iconClass: "text-(--theme-taupe)",
      valueClass: "text-(--theme-burgundy-950)",
    },
    {
      label: "Low Stock Warnings",
      value: stats.lowStock,
      icon: Layers,
      iconClass: stats.lowStock > 0 ? "animate-pulse text-amber-500" : "text-gray-400",
      valueClass: stats.lowStock > 0 ? "text-amber-600" : "text-(--theme-burgundy-950)",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
      icon: Ban,
      iconClass: stats.outOfStock > 0 ? "animate-pulse text-red-500" : "text-gray-400",
      valueClass: stats.outOfStock > 0 ? "text-red-600" : "text-(--theme-burgundy-950)",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cardsConfig.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <Card key={idx} className="theme-card flex flex-col justify-between gap-0! p-5!">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-(--theme-burgundy-600) uppercase">
                {card.label}
              </span>
              <IconComponent className={`h-5 w-5 ${card.iconClass}`} />
            </div>
            <div className="mt-2.5">
              <span className={`text-3xl leading-none font-bold ${card.valueClass}`}>
                {card.value}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
