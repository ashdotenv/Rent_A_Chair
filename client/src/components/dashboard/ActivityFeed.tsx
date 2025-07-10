"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  time: string;
  status: string;
}

interface ActivityFeedProps {
  title: string;
  description?: string;
  activities: ActivityItem[];
  getIcon: (type: string) => LucideIcon;
  getStatusBadge: (status: string) => React.ReactNode;
  className?: string;
}

export function ActivityFeed({
  title,
  description,
  activities,
  getIcon,
  getStatusBadge,
  className = "",
}: ActivityFeedProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 