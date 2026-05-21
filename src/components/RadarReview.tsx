import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function RadarReview({ data }: { data: { domain: string; score: number }[] }) {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#1f2937" />
          <PolarAngleAxis dataKey="domain" stroke="#9ca3af" />
          <PolarRadiusAxis stroke="#374151" domain={[0, 100]} />
          <Radar dataKey="score" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
