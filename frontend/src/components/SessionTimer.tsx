interface Props {
  formatted: string;
}

export default function SessionTimer({ formatted }: Props) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      <span aria-hidden="true">⏱</span>
      <span className="font-mono tabular-nums">{formatted}</span>
    </div>
  );
}
