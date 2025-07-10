"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

interface DashboardStatsProps {
  stats: StatItem[];
  className?: string;
}

export function DashboardStats({ stats, className = "" }: DashboardStatsProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.change && (
                  <p
                    className={`text-sm ${stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                  >
                    {stat.change}
                  </p>
                )}
              </div>
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 