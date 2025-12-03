"use client";
import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

export function GenericBarChart({
  data, xKey, series
}:{ data:any[]; xKey:string; series:{key:string; name:string; color?:string}[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={xKey} /><YAxis /><Tooltip /><Legend />
          {series.map(s => <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || "var(--brand,#0288D1)"} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GenericLineChart({
  data, xKey, yKey, name, color
}:{ data:any[]; xKey:string; yKey:string; name?:string; color?:string }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={xKey} /><YAxis /><Tooltip /><Legend />
          <Line type="monotone" dataKey={yKey} name={name} stroke={color || "var(--brand-strong,#01579B)"} strokeWidth={2}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GenericPie({
  data, nameKey, valueKey, colors=[]
}:{ data:any[]; nameKey:string; valueKey:string; colors?:string[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart><Tooltip /><Legend />
          <Pie data={data} nameKey={nameKey} dataKey={valueKey} outerRadius={100}>
            {data.map((_, i) => <Cell key={i} fill={(colors[i % colors.length]) || "#00BCD4"} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
