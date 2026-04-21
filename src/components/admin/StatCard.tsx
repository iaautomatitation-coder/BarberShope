export default function StatCard({
  label,
  value,
  hint,
  accent = 'amber',
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: 'amber' | 'green' | 'blue' | 'rose';
}) {
  const accentMap = {
    amber: 'from-amber-500/20 to-amber-900/5 border-amber-500/20 text-amber-400',
    green: 'from-emerald-500/20 to-emerald-900/5 border-emerald-500/20 text-emerald-400',
    blue: 'from-sky-500/20 to-sky-900/5 border-sky-500/20 text-sky-400',
    rose: 'from-rose-500/20 to-rose-900/5 border-rose-500/20 text-rose-400',
  } as const;

  return (
    <div className={`relative rounded-2xl border bg-gradient-to-br ${accentMap[accent]} p-5 overflow-hidden`}>
      <div className="absolute inset-0 bg-gray-900/60" />
      <div className="relative">
        <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">{label}</div>
        <div className={`mt-2 text-3xl font-bold ${accentMap[accent].split(' ').pop()}`}>{value}</div>
        {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
      </div>
    </div>
  );
}
