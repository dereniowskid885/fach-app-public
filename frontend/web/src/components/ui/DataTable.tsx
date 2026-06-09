'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/shadcn/table';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Checkbox } from '../shadcn/checkbox';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  selectableRows?: boolean;
  oneSelectableRow?: boolean;
  setSelectedRow?: Dispatch<SetStateAction<RowSelectionState>>;
  data: TData[];
  tableClassName?: string;
  headClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  selectableRows = false,
  oneSelectableRow = false,
  setSelectedRow,
  tableClassName,
  headClassName
}: DataTableProps<TData, TValue>) {
  const t = useTranslations();
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (!setSelectedRow) return;

    setSelectedRow(rowSelection);
  }, [rowSelection, setSelectedRow]);

  if (selectableRows) {
    columns = [
      {
        id: 'select',
        header: '',
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => {
              if (oneSelectableRow) setRowSelection({});
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      ...columns
    ];
  }

  const table = useReactTable({
    data,
    columns,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection
    }
  });

  return (
    <div className="overflow-x-auto rounded-2xl border">
      <Table className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-muted-foreground text-center text-xs font-bold tracking-wide text-nowrap uppercase',
                      headClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t('common.noResults')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
