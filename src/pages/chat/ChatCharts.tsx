import type { ChatChart } from "../../models/chat";

const colors = ["#ca8a04", "#0f766e", "#475569", "#7c3aed"];
const number = (value: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, notation: Math.abs(value) >= 100000 ? "compact" : "standard" }).format(value);
const exactNumber = (value: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 }).format(value);

export default function ChatCharts({ chart, currency }: { chart: ChatChart; currency: string }) {
  const count = Math.min(chart.labels.length, chart.type === "bar" ? 30 : 366);
  if (!count || !chart.series.length) return <p className="text-sm text-gray-500">No chart data for this period.</p>;
  const series = chart.series.map(item => ({ ...item, values: item.values.slice(0, count).map(value => Number.isFinite(value) ? value : 0) }));
  const values = series.flatMap(item => item.values);
  const minimum = Math.min(0, ...values), maximum = Math.max(1, ...values);
  const width = 640, height = 260, left = 58, right = 18, top = 18, bottom = 42;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const y = (value: number) => top + (maximum - value) / (maximum - minimum) * plotHeight;
  const lineX = (index: number) => left + index / Math.max(1, count - 1) * plotWidth;
  const group = plotWidth / count;
  const tickStep = Math.max(1, Math.ceil(count / 5));
  return (
    <figure className="min-w-0 rounded-xl border border-gray-200 bg-white p-3">
      <figcaption className="mb-2 text-sm font-semibold">{chart.title}{currency ? ` · ${currency}` : ""}</figcaption>
      <svg className="w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${chart.title}. Exact values are available in the table below.`}>
        {Array.from({ length: 5 }, (_, index) => {
          const value = minimum + (maximum - minimum) * index / 4;
          return <g key={index}><line x1={left} x2={width - right} y1={y(value)} y2={y(value)} stroke="#e5e7eb" /><text x={left - 8} y={y(value) + 4} textAnchor="end" fontSize={10} fill="#64748b">{number(value)}</text></g>;
        })}
        <line x1={left} x2={width - right} y1={y(0)} y2={y(0)} stroke="#94a3b8" />
        {series.map((item, seriesIndex) => chart.type === "line" ? (
          <g key={item.name}>
            <polyline points={item.values.map((value, index) => `${lineX(index)},${y(value)}`).join(" ")} fill="none" stroke={colors[seriesIndex % colors.length]} strokeWidth={2.5} />
            {count === 1 && <circle cx={lineX(0)} cy={y(item.values[0])} r={4} fill={colors[seriesIndex % colors.length]} />}
          </g>
        ) : item.values.map((value, index) => {
          const barWidth = Math.max(1, group * .8 / series.length);
          return <rect key={`${seriesIndex}-${index}`} x={left + index * group + group * .1 + barWidth * seriesIndex} y={Math.min(y(0), y(value))} width={barWidth - Math.min(1, barWidth / 4)} height={Math.abs(y(value) - y(0))} rx={2} fill={colors[seriesIndex % colors.length]}><title>{`${chart.labels[index]} · ${item.name}: ${value} ${currency}`}</title></rect>;
        }))}
        {chart.labels.slice(0, count).map((label, index) => (index % tickStep === 0 || index === count - 1) && <text key={index} x={chart.type === "line" ? lineX(index) : left + (index + .5) * group} y={height - 18} textAnchor="middle" fontSize={10} fill="#64748b">{label.length > 14 ? `${label.slice(0, 12)}…` : label}</text>)}
      </svg>
      <div className="flex flex-wrap gap-3 text-xs text-gray-600">{series.map((item, index) => <span key={item.name} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />{item.name}</span>)}</div>
      {count < chart.labels.length && <p className="mt-2 text-xs text-gray-500">Chart shows the first {count} groups. The table includes all results.</p>}
      <details className="mt-3 text-xs">
        <summary className="cursor-pointer font-medium text-gray-600">View exact values</summary>
        <div className="mt-2 max-h-64 overflow-auto"><table className="w-full text-left"><thead><tr><th className="p-2">Period / category</th>{chart.series.map(item => <th key={item.name} className="p-2 text-right">{item.name}</th>)}</tr></thead><tbody>{chart.labels.map((label, index) => <tr key={index} className="border-t border-gray-100"><td className="p-2">{label}</td>{chart.series.map(item => <td key={item.name} className="p-2 text-right tabular-nums">{exactNumber(item.values[index] ?? 0)}</td>)}</tr>)}</tbody></table></div>
      </details>
    </figure>
  );
}
