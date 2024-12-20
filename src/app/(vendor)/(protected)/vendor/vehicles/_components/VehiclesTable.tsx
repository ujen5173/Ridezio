// TODO: Vehicle available status

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
import {
  ChevronDown,
  Edit,
  Expand,
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
  images: {
    url: string;
    order: number;
    id: string;
  }[];
  status: "available" | "Unavailable";
  features: { key: string; value: string }[];
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
        <div className="px-4">
          <Image
            src={image[0]!.url}
            alt="Vehicle"
            width={640}
            height={390}
            className="aspect-video max-w-28 rounded-sm object-contain mix-blend-multiply"
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
              `${type}-badge`,
            )}
          >
            <div
              className={cn("size-1.5 rounded-full", {
                "bg-car-color": type === "car",
                "bg-e-car-color": type === "e-car",
                "bg-bike-color": type === "bike",
                "bg-bicycle-color": type === "bicycle",
                "bg-e-bicycle-color": type === "e-bicycle",
                "bg-scooter-color": type === "scooter",
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
  {
    accessorKey: "totalRentals",
    header: () => (
      <div className="w-max break-keep px-4">Total Rented Count</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="w-max break-keep px-4 capitalize">
          {row.getValue<number>("totalRentals")}
        </div>
      );
    },
  },
  {
    accessorKey: "features",
    header: () => <div className="w-max break-keep px-4">Features</div>,
    cell: ({ row }) => {
      return (
        <div className="px-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"} size="sm">
                <Expand size={13} className="mr-1 text-slate-600" />
                Expand to view
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Features of{" "}
                  <span className="font-semibold text-secondary underline underline-offset-2">
                    {row.getValue<string>("name")}
                  </span>
                </DialogTitle>
              </DialogHeader>
              <div className="mb-2 border border-border">
                {row
                  .getValue<
                    {
                      key: string;
                      value: string;
                    }[]
                  >("features")
                  .map((feature, index) => {
                    return (
                      <div
                        key={index}
                        className="flex border-b border-border last:border-0"
                      >
                        <span className="h-full w-40 border-r border-border bg-slate-100 p-4 text-sm font-semibold">
                          {feature.key}
                        </span>
                        <span className="p-4 text-sm">{feature.value}</span>
                      </div>
                    );
                  })}
              </div>
              <DialogFooter className="flex items-center">
                <Link
                  href={`/vendor/vehicles/add?edit=${row.getValue<string>("id")}`}
                >
                  <Button variant={"primary"}>
                    <Edit size={18} className="mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant={"outline"}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
    images: vehicle.images,
    status: vehicle.inventory === 0 ? "Unavailable" : "available",
    totalRentals: vehicle.totalRentals,
    features: vehicle.features,
    category: vehicle.category,
    createdAt: formatDate(new Date(vehicle.createdAt), "dd MMM, yyyy"),
  }));

const VehiclesTable = () => {
  const {
    data = [],
    isLoading,
    refetch,
    isRefetching,
    isError,
  } = api.vehicle.getVendorVehicles.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchOnWindowFocus: false,
  });

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
              <Loader size={15} className="mr-1 animate-spin text-slate-600" />
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
                        <TableCell key={`${index}-${cellIndex} px-4`}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
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
