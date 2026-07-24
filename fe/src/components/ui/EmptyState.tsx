interface Props {
  message?: string;
}

export function EmptyState({ message = 'No data found' }: Props) {
  return (
    <div className="text-center py-12 text-slate-400 text-sm">
      <p>{message}</p>
    </div>
  );
}
