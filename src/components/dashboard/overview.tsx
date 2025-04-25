"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Apr 1",
    leads: 45,
    joins: 32,
  },
  {
    name: "Apr 5",
    leads: 52,
    joins: 38,
  },
  {
    name: "Apr 10",
    leads: 48,
    joins: 35,
  },
  {
    name: "Apr 15",
    leads: 70,
    joins: 55,
  },
  {
    name: "Apr 20",
    leads: 61,
    joins: 49,
  },
  {
    name: "Apr 25",
    leads: 65,
    joins: 52,
  },
  {
    name: "Apr 30",
    leads: 75,
    joins: 60,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="leads" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="joins" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
