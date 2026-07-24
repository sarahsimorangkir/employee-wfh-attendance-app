interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
}: Props<T>) {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-md shadow-2xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((item) => (
            <tr key={item[keyField]} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
