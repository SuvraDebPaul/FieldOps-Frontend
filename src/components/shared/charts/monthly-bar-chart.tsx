"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint } from "@/utils";

interface MonthlyBarChartProps {
  data: MonthlyPoint[];
  valueLabel: string;
  formatValue: (value: number) => string;
}

export default function MonthlyBarChart({
  data,
  valueLabel,
  formatValue,
}: MonthlyBarChartProps) {
  return (
    <>
      <div
        className="h-64 w-full"
        role="img"
        aria-label={`${valueLabel} per month, bar chart`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              width={64}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(v: number) => formatValue(v)}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              formatter={(value) => [formatValue(Number(value)), valueLabel]}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--popover-foreground)",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="value"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>{valueLabel} per month</caption>
        <tbody>
          {data.map((point) => (
            <tr key={point.key}>
              <th scope="row">{point.label}</th>
              <td>{formatValue(point.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
