"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions: ActionItem[];
  className?: string;
}

export function QuickActions({ actions, className = "" }: QuickActionsProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {actions.map((action) => (
        <Card key={action.title}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <action.icon className="mr-2 h-5 w-5" />
              {action.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{action.description}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={action.onClick}
            >
              {action.action}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 