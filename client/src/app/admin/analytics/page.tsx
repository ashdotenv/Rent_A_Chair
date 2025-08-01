"use client";

import React from "react";
import { useGetFurnitureAnalyticsQuery, useGetRentalAnalyticsQuery, useLazyGetFurnitureAnalyticsQuery, useGetUserAnalyticsQuery } from "@/redux/features/admin/adminApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnalyticsBarChart, AnalyticsPieChart } from "./Chart";

export default function AdminAnalyticsPage() {
  // Fetch analytics data
  const { data: furnitureAnalytics, isLoading: isFurnitureLoading, error: furnitureError } = useGetFurnitureAnalyticsQuery("");
  const { data: rentalAnalytics, isLoading: isRentalLoading, error: rentalError } = useGetRentalAnalyticsQuery("");
  const { data: userAnalytics, isLoading: isUserLoading, error: userError } = useGetUserAnalyticsQuery("");
  const [triggerFurnitureAnalytics, { data: lazyFurnitureData, isLoading: isLazyLoading, error: lazyError }] = useLazyGetFurnitureAnalyticsQuery();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Analytics</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Furniture Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Furniture Analytics</CardTitle>
            <CardDescription>Overview of furniture-related analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            {isFurnitureLoading ? (
              <p>Loading...</p>
            ) : furnitureError ? (
              <p className="text-red-500">Error loading furniture analytics.</p>) : furnitureAnalytics && furnitureAnalytics.report ? (
                <>
                  <AnalyticsBarChart
                    data={[{ name: furnitureAnalytics.report.model, value: furnitureAnalytics.report.totalCount }]}
                    dataKey="value"
                    xKey="name"
                    color="#1980E5"
                  />
                  <div className="mt-2 text-xs text-gray-700">
                    <div>Model: <b>{furnitureAnalytics.report.model}</b></div>
                    <div>Total Count: <b>{furnitureAnalytics.report.totalCount}</b></div>
                    {furnitureAnalytics.report.totalSum !== null && (
                      <div>Total Sum: <b>{furnitureAnalytics.report.totalSum}</b></div>
                    )}
                  </div>
                </>
              ) : (
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(furnitureAnalytics, null, 2)}</pre>
            )}
           
            {isLazyLoading && <p>Refetching...</p>}
            {lazyFurnitureData && lazyFurnitureData.report && (
              <div className="mt-2">
                <AnalyticsBarChart
                  data={[{ name: lazyFurnitureData.report.model, value: lazyFurnitureData.report.totalCount }]}
                  dataKey="value"
                  xKey="name"
                  color="#1980E5"
                />
                <div className="mt-2 text-xs text-gray-700">
                  <div>Model: <b>{lazyFurnitureData.report.model}</b></div>
                  <div>Total Count: <b>{lazyFurnitureData.report.totalCount}</b></div>
                  {lazyFurnitureData.report.totalSum !== null && (
                    <div>Total Sum: <b>{lazyFurnitureData.report.totalSum}</b></div>
                  )}
                </div>
              </div>
            )}
            {lazyError && <p className="text-red-500">Error with lazy fetch.</p>}
          </CardContent>
        </Card>
        {/* Rental Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Analytics</CardTitle>
            <CardDescription>Overview of rental-related analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            {isRentalLoading ? (
              <p>Loading...</p>
            ) : rentalError ? (
              <p className="text-red-500">Error loading rental analytics.</p>
            ) : rentalAnalytics && rentalAnalytics.report ? (
              <>
                <AnalyticsPieChart
                  data={[{ name: rentalAnalytics.report.model, value: rentalAnalytics.report.totalCount }]}
                  dataKey="value"
                  nameKey="name"
                />
                <div className="mt-2 text-xs text-gray-700">
                  <div>Model: <b>{rentalAnalytics.report.model}</b></div>
                  <div>Total Count: <b>{rentalAnalytics.report.totalCount}</b></div>
                  {rentalAnalytics.report.totalSum !== null && (
                    <div>Total Sum: <b>{rentalAnalytics.report.totalSum}</b></div>
                  )}
                </div>
              </>
            ) : (
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(rentalAnalytics, null, 2)}</pre>
            )}
          </CardContent>
        </Card>
        {/* User Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
            <CardDescription>Overview of user-related analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            {isUserLoading ? (
              <p>Loading...</p>
            ) : userError ? (
              <p className="text-red-500">Error loading user analytics.</p>
            ) : userAnalytics && userAnalytics.report ? (
              <>
                <AnalyticsBarChart
                  data={[{ name: userAnalytics.report.model, value: userAnalytics.report.totalCount }]}
                  dataKey="value"
                  xKey="name"
                  color="#36A2EB"
                />
                <div className="mt-2 text-xs text-gray-700">
                  <div>Model: <b>{userAnalytics.report.model}</b></div>
                  <div>Total Count: <b>{userAnalytics.report.totalCount}</b></div>
                  {userAnalytics.report.totalSum !== null && (
                    <div>Total Sum: <b>{userAnalytics.report.totalSum}</b></div>
                  )}
                </div>
              </>
            ) : (
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(userAnalytics, null, 2)}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
