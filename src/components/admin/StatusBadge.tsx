import { STATUS_LABELS, type AppointmentStatus } from '@/lib/appointment-status';

const STYLES: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  confirmed: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  rescheduled: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  no_show: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

export default function StatusBadge({ status }: { status: string }) {
  const key = (status in STATUS_LABELS ? status : 'pending') as AppointmentStatus;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${STYLES[key]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {STATUS_LABELS[key]}
    </span>
  );
}
