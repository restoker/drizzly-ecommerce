"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AlertDelete from "./ui/AlertDelete"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data, }: DataTableProps<TData, TValue>) {

  const [sort, setSort] = useState<SortingState>([]);
  const [columnfilters, setColumnfilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnfilters,
    state: {
      sorting: sort,
      columnFilters: columnfilters,
    }
  });



  return (
    <div className="rounded-md border my-20 h-full">
      <AlertDelete />
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>List to all your products</CardDescription>
        </CardHeader>

        <CardContent>
          <div>
            <div>
              <Input
                className="w-60"
                placeholder="Filter products"
                value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead className="border-x-zinc-900/10 border" key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="text-center lg:w-[100px] xl:w-[200px] text-ellipsis text-sm border-x-zinc-900/10 border" key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results 😥.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-4">
              <Button
                variant={'outline'}
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              <Button
                variant={'outline'}
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>

      </Card>



    </div>
  )
}