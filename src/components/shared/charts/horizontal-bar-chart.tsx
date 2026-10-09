"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HorizontalBarChartProps {
  data: { label: string; value: number }[];
  valueLabel: string;
}

const TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

export default function HorizontalBarChart({
  data,
  valueLabel,
}: HorizontalBarChartProps) {
  return (
    <>
      <div
        className="w-full"
        style={{ height: Math.max(180, data.length * 34) }}
        role="img"
        aria-label={`${valueLabel}, bar chart`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 32, bottom: 0, left: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={TICK}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={92}
              tickLine={false}
              axisLine={false}
              tick={TICK}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              formatter={(value) => [value, valueLabel]}
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
              radius={[0, 4, 4, 0]}
              maxBarSize={18}
            >
              <LabelList
                dataKey="value"
                position="right"
                fill="var(--muted-foreground)"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>{valueLabel}</caption>
        <tbody>
          {data.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
