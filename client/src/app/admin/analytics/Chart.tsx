"use client";
import * as React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type ChartDataItem = {
  [key: string]: number | string | null;
};

interface AnalyticsBarChartProps {
  data: ChartDataItem[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}

export function AnalyticsBarChart({
  data,
  dataKey,
  xKey,
  color = "#1980E5",
  height = 250,
}: AnalyticsBarChartProps) {
  if (!data || !Array.isArray(data) || data.length === 0)
    return <div>No data</div>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const COLORS = ["#1980E5", "#FFBB28", "#FF8042", "#00C49F", "#FF6384", "#36A2EB"];

interface AnalyticsPieChartProps {
  data: ChartDataItem[];
  dataKey: string;
  nameKey: string;
  height?: number;
}

export function AnalyticsPieChart({
  data,
  dataKey,
  nameKey,
  height = 250,
}: AnalyticsPieChartProps) {
  if (!data || !Array.isArray(data) || data.length === 0)
    return <div>No data</div>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
