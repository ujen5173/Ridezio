"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Edit,
  Loader,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export interface Accessory {
  id: string;
  name: string;
  brand: string | null;
  sizes: string[];
  colors: string[];
  inventory: number;
  basePrice: number;
  images: {
    url: string;
    order: number;
    id: string;
  }[];
  category: string;
  createdAt: Date;
}

export const columns: ColumnDef<Accessory>[] = [
  {
    accessorKey: "id",
    header: () => <div className="w-max break-keep px-4 pl-4">UUID</div>,
    cell: ({ row }) => (
      <div className="w-max break-keep px-4 pl-4 capitalize">
        #...{row.getValue<string>("id").slice(-6)}
      </div>
    ),
  },
  {
    accessorKey: "images",
    header: () => <div className="w-max break-keep px-4">Image</div>,
    cell: ({ row }) => {
      const image = row.getValue<
        {
          url: string;
          order: number;
          id: string;
        }[]
      >("images");

      return (
        <div className="relative h-16 w-32">
          <div className="absolute inset-0 z-0 animate-pulse rounded-md bg-slate-600/10"></div>
          <Image
            src={image[0]!.url}
            alt="accessory"
            width={640}
            height={390}
            className="relative z-10 h-16 w-32 rounded-sm bg-white object-contain"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="w-max break-keep px-4">Name</div>,
    cell: ({ row }) => (
      <div className="w-max break-keep px-4 capitalize">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: () => <div className="w-max break-keep px-4">Category</div>,
    cell: ({ row }) => (
      <div className="w-max break-keep px-4 capitalize">
        {row.getValue("category")}
      </div>
    ),
  },
  {
    accessorKey: "brand",
    header: () => <div className="w-max break-keep px-4">Brand</div>,
    cell: ({ row }) => {
      const brand = row.getValue<string | null>("brand");
      return (
        <div className="w-max break-keep px-4 capitalize">{brand ?? "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "inventory",
    header: () => <div className="w-max break-keep px-4">Inventory</div>,
    cell: ({ row }) => {
      const inventory = row.getValue<number>("inventory");
      return (
        <div className="w-max break-keep px-4 capitalize">
          {inventory === 0 ? (
            <span className="text-red-500">Out of stock</span>
          ) : (
            <span className="text-slate-700">{inventory} in stock</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "basePrice",
    header: () => <div className="w-max break-keep px-4">Price per day</div>,
    cell: ({ row }) => {
      // Use useMemo or move formatter to component level to prevent hydration issues
      const amount = row.getValue<number>("basePrice");
      return (
        <div className="w-max break-keep px-4 capitalize">
          {Intl.NumberFormat("en-NP", {
            style: "currency",
            currency: "NPR",
          }).format(+(amount.toLocaleString() ?? 0))}
        </div>
      );
    },
  },
];

const AccessoriesTable = () => {
  const {
    data = [],
    isLoading,
    refetch,
    isRefetching,
    isError,
  } = api.accessories.getVendorAccessories.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const accessories = useMemo<Accessory[]>(() => {
    return data;
  }, [data]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: accessories,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Something went wrong while getting orders. Try again later.",
        variant: "destructive",
      });
    }
  }, [isError]);

  return (
    <>
      <div className="w-full py-4 md:py-0">
        <div className="mb-4 flex items-center justify-between md:mb-0">
          <h1 className="text-2xl font-semibold">Manage Accessories</h1>
          <Link href={`/vendor/accessories/add`}>
            <Button size="sm" variant="secondary">
              <Plus className="mr-1" size={15} />
              Add New
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4 py-4">
          <Input
            placeholder="Filter names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-10 max-w-sm flex-1"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => {
                void refetch();
              }}
              size="sm"
              variant={"outline"}
            >
              {isRefetching ? (
                <Loader
                  size={15}
                  className="mr-1 animate-spin text-slate-600"
                />
              ) : (
                <RefreshCcw size={15} className="mr-1 text-slate-600" />
              )}
              {isRefetching ? "Refreshing" : "Refresh"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" size="sm" className="ml-auto gap-1">
                  Columns <ChevronDown className="text-inherit" size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="break-keep capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-slate-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-14 w-max break-keep"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                  <TableHead className="h-14 w-max break-keep"></TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array(4)
                    .fill("____")
                    .map((_, index) => (
                      <TableRow key={index} className="h-14">
                        {columns.map((_, cellIndex) => (
                          <TableCell key={`${index}-${cellIndex} px-4`}>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </>
              ) : accessories.length ? (
                <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className={cn("h-14", {
                          "bg-red-50 hover:bg-red-50":
                            row.getValue("inventory") === 0,
                        })}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="">
                          <div className="flex items-center justify-end gap-2 px-4">
                            <Link
                              href={`/vendor/accessories/add?edit=${row.getValue<string>("id")}`}
                            >
                              <Button
                                className="text-slate-600"
                                variant={"outline"}
                                size="sm"
                              >
                                <Edit size={13} className="mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button variant={"destructive"} size="sm">
                              <Trash2 size={13} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-56 text-center text-base"
                  >
                    No accessories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default AccessoriesTable;
