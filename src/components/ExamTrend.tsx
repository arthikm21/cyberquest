import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import { ExamAttempt } from '../lib/storage';

export default function ExamTrend({ attempts }: { attempts: ExamAttempt[] }) {
  const data = attempts.slice(-10).map((a, i) => ({
    n: i + 1,
    scaled: a.scaledScore,
    date: new Date(a.finishedTs).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));
  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -16 }}>
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 1000]} stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
          <ReferenceLine y={700} stroke="#10b981" strokeDasharray="4 4" />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Line dataKey="scaled" stroke="#00d4ff" strokeWidth={2} dot={{ r: 3, fill: '#00d4ff' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
