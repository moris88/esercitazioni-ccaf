import type { TableStep } from '../types';

interface StepTableProps {
  table: TableStep;
}

/** Tabella le cui righe compaiono una dopo l'altra */
export function StepTable({ table }: StepTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.9em]">
        <thead>
          <tr className="border-b-2 border-accent">
            {table.columns.map((column) => (
              <th key={column} className="px-2 py-1.5">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={row[0]}
              className={`animate-enter border-b border-line ${table.highlight?.includes(rowIndex) ? 'bg-blush font-bold' : ''}`}
              style={{ animationDelay: `${rowIndex * 150}ms`, animationFillMode: 'backwards' }}
            >
              {row.map((cell, cellIndex) => (
                <td key={table.columns[cellIndex]} className="px-2 py-1.5 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
