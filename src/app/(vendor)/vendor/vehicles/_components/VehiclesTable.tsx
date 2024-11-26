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
import { formatDate } from "date-fns";
import { ChevronDown, Edit, Plus, Trash2 } from "lucide-react";
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
import { type GetBusinessVehicleType } from "~/server/api/routers/vehicle";
import { type vehicleTypeEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";

export interface Vehicle {
  id: string;
  name: string;
  type: (typeof vehicleTypeEnum.enumValues)[number];
  inventory: number;
  basePrice: number;
  image: string;
  status: "available" | "Unavailable";
  features: string;
  category: string;
  createdAt: string;
}

export const columns: ColumnDef<Vehicle>[] = [
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
    accessorKey: "image",
    header: () => <div className="w-max break-keep px-4">Image</div>,
    cell: ({ row }) => {
      const image = row.getValue<string>("image");

      return (
        <div className="w-max px-4">
          <Image
            src={image}
            alt="Vehicle"
            width={100}
            height={200}
            className="w-16 rounded-sm object-cover mix-blend-multiply"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="w-max break-keep px-4">Vehicle Name</div>,
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
    accessorKey: "type",
    header: () => <div className="w-max break-keep px-4">Type</div>,
    cell: ({ row }) => {
      const type =
        row.getValue<(typeof vehicleTypeEnum.enumValues)[number]>("type");

      return (
        <div className="px-4">
          <div
            className={cn(
              "flex w-fit items-center gap-1 rounded-sm border px-2 py-1 font-medium",
              {
                "border-blue-500 bg-blue-50 text-blue-500": type === "bike",
                "border-red-500 bg-red-50 text-red-500": type === "car",
                "border-orange-500 bg-orange-50 text-orange-500":
                  type === "scooter",
                "border-green-500 bg-green-50 text-green-500":
                  type === "e-bicycle",
              },
            )}
          >
            <div
              className={cn("size-1.5 rounded-full", {
                "bg-slate-500": type === "bicycle",
                "bg-red-500": type === "car",
                "bg-orange-500": type === "scooter",
                "bg-blue-500": type === "bike",
                "bg-green-500": type === "e-bicycle",
              })}
            />
            <span className="text-xs capitalize">{type}</span>
          </div>
        </div>
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
          NPR {amount.toLocaleString()}
        </div>
      );
    },
  },
];

// This function is just to transform the data from the API to the format that the table expects
const transformApiData = (data: GetBusinessVehicleType = []): Vehicle[] =>
  data.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    type: vehicle.type,
    inventory: vehicle.inventory,
    basePrice: vehicle.basePrice,
    image: vehicle.images[0] ?? "",
    status: vehicle.inventory === 0 ? "Unavailable" : "available",
    features: vehicle.features.map((feature) => feature.key).join(", "),
    category: vehicle.category,
    createdAt: formatDate(new Date(vehicle.createdAt), "dd MMM, yyyy"),
  }));

const VehiclesTable = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = api.vehicle.getVendorVehicles.useQuery();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const vehicles = useMemo(() => transformApiData(data), [data]);

  const table = useReactTable({
    data: vehicles,
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
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage your Vehicles</h1>
        <Link href={`/vendor/vehicles/add`}>
          <Button size="sm" variant="secondary">
            <Plus className="mr-1" size={15} />
            Add Vehicle
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-10 max-w-sm flex-1"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto gap-1">
              Columns <ChevronDown className="text-slate-700" size={18} />
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

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-14 w-max break-keep">
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
                        <TableCell key={`${index}-${cellIndex}`}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                      <TableCell className="">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : vehicles.length ? (
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
                            href={`/vendor/vehicles/add?edit=${row.getValue<string>("id")}`}
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
                  className="h-24 text-center"
                >
                  No vehicles found.
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
  );
};

export default VehiclesTable;
