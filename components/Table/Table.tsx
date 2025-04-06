'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

// Define data structure
type EmployeeData = {
  empId: string;
  name: string;
  numberOfSessions: number;
  pendingSessions: number;
  lastLeave: string;
  performanceReview: string;
};

// Dummy employee data
const employeeData: EmployeeData[] = [
  { empId: 'EP001', name: 'Alice Johnson', numberOfSessions: 28, pendingSessions: 2, lastLeave: '3rd March', performanceReview: '4 (Annual)' },
  { empId: 'EP002', name: 'Bob Smith', numberOfSessions: 22, pendingSessions: 8, lastLeave: '15th February', performanceReview: '3 (H1)' },
  { empId: 'EP003', name: 'Clara Lee', numberOfSessions: 18, pendingSessions: 12, lastLeave: '10th January', performanceReview: '2 (H2)' },
  { empId: 'EP004', name: 'David Kim', numberOfSessions: 30, pendingSessions: 0, lastLeave: '6th April', performanceReview: '4 (H2)' },
  { empId: 'EP005', name: 'Eva Mendes', numberOfSessions: 25, pendingSessions: 5, lastLeave: '21st March', performanceReview: '3 (Annual)' },
  { empId: 'EP006', name: 'Frank Turner', numberOfSessions: 16, pendingSessions: 14, lastLeave: '27th February', performanceReview: '2 (H1)' },
  { empId: 'EP007', name: 'Grace Liu', numberOfSessions: 29, pendingSessions: 1, lastLeave: '1st April', performanceReview: '4 (H1)' },
  { empId: 'EP008', name: 'Henry Wallace', numberOfSessions: 10, pendingSessions: 20, lastLeave: '12th January', performanceReview: '1 (Annual)' },
  { empId: 'EP009', name: 'Ivy Zhang', numberOfSessions: 19, pendingSessions: 11, lastLeave: '9th March', performanceReview: '3 (H2)' },
  { empId: 'EP010', name: 'Jack Rivera', numberOfSessions: 26, pendingSessions: 4, lastLeave: '25th February', performanceReview: '4 (Annual)' },
];

// Define columns for the table
const columns: ColumnDef<EmployeeData>[] = [
  { accessorKey: 'empId', header: 'Employee ID', cell: info => info.getValue() },
  { accessorKey: 'name', header: 'Name', cell: info => info.getValue() },
  { accessorKey: 'numberOfSessions', header: 'Number of Sessions', cell: info => info.getValue() },
  { accessorKey: 'pendingSessions', header: 'Pending Sessions', cell: info => info.getValue() },
  { accessorKey: 'lastLeave', header: 'Last Leave', cell: info => info.getValue() },
  { accessorKey: 'performanceReview', header: 'Performance Review', cell: info => info.getValue() },
];

const TableComponent = () => {
  const [data] = useState(() => [...employeeData]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Employee Sessions Overview</h2>

      <input
        type="text"
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="text-left px-4 py-2 cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
