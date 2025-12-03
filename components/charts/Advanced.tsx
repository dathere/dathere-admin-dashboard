"use client";
import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  Bar, Line, Cell, Treemap, FunnelChart, Funnel, LabelList
} from "recharts";

// Area Chart (Filled Line Chart)
export function GenericAreaChart({
  data, xKey, series
}: { data: any[]; xKey: string; series: { key: string; name: string; color?: string }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map(s => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color || "#0288D1"}
              fill={s.color || "#0288D1"}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Stacked Bar Chart
export function StackedBarChart({
  data, xKey, series
}: { data: any[]; xKey: string; series: { key: string; name: string; color?: string }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map(s => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              stackId="a"
              fill={s.color || "#0288D1"}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// Combo Chart (Bar + Line)
export function ComboChart({
  data, xKey, bars, lines
}: {
  data: any[];
  xKey: string;
  bars: { key: string; name: string; color?: string }[];
  lines: { key: string; name: string; color?: string }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {bars.map(b => (
            <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color || "#0288D1"} />
          ))}
          {lines.map(l => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name}
              stroke={l.color || "#FF5722"}
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// Scatter Plot
export function ScatterPlot({
  data, xKey, yKey, name, color
}: { data: any[]; xKey: string; yKey: string; name?: string; color?: string }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} name={xKey} />
          <YAxis dataKey={yKey} name={yKey} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name={name || "Data"} data={data} fill={color || "#0288D1"} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

// Radar Chart
export function RadarChartComponent({
  data, categories, series
}: {
  data: any[];
  categories: string;
  series: { key: string; name: string; color?: string }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={categories} />
          <PolarRadiusAxis />
          <Tooltip />
          <Legend />
          {series.map(s => (
            <Radar
              key={s.key}
              name={s.name}
              dataKey={s.key}
              stroke={s.color || "#0288D1"}
              fill={s.color || "#0288D1"}
              fillOpacity={0.6}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Donut Chart
export function DonutChart({
  data, nameKey, valueKey, colors = [], innerRadius = 60
}: { data: any[]; nameKey: string; valueKey: string; colors?: string[]; innerRadius?: number }) {
  const COLORS = colors.length > 0 ? colors : ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PolarRadiusAxis>
          <Tooltip />
          <Legend />
          <Cell>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Cell>
        </PolarRadiusAxis>
      </ResponsiveContainer>
    </div>
  );
}

// Multi-Line Chart
export function MultiLineChart({
  data, xKey, lines
}: {
  data: any[];
  xKey: string;
  lines: { key: string; name: string; color?: string }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map(l => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name}
              stroke={l.color || "#0288D1"}
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// Treemap
export function TreemapChart({
  data, nameKey, sizeKey, colors = []
}: { data: any[]; nameKey: string; sizeKey: string; colors?: string[] }) {
  const COLORS = colors.length > 0 ? colors : ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];
  
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <Treemap
          data={data}
          dataKey={sizeKey}
          nameKey={nameKey}
          stroke="#fff"
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

// Funnel Chart
export function FunnelChartComponent({
  data, nameKey, valueKey
}: { data: any[]; nameKey: string; valueKey: string }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <FunnelChart>
          <Tooltip />
          <Funnel dataKey={valueKey} data={data} isAnimationActive>
            <LabelList position="right" fill="#000" stroke="none" dataKey={nameKey} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

// Horizontal Bar Chart
export function HorizontalBarChart({
  data, yKey, series
}: { data: any[]; yKey: string; series: { key: string; name: string; color?: string }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey={yKey} type="category" />
          <Tooltip />
          <Legend />
          {series.map(s => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || "#0288D1"} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
