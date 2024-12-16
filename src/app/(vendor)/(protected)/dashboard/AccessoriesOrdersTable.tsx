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
import { Plus } from "lucide-react";
import * as React from "react";
import Bookings from "~/app/(normal-user)/(others)/vendor/[slug]/_components/Bookings";
import { Button } from "~/components/ui/button";
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
import { type GetOrders } from "~/server/api/routers/accessories";
import { type GetDashboardInfo } from "~/server/api/routers/business";
import { api } from "~/trpc/react";

export type Order = GetOrders[0];

const AccessoriesOrdersTable = ({ data }: { data: GetDashboardInfo }) => {
  const { data: vendor } = api.business.current.useQuery();
  const {
    data: ordersData = [],
    isLoading,
    isError,
  } = api.accessories.getOrders.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<Order>[] = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <div className="w-max break-keep px-4 pl-4">UUID</div>,
        cell: ({ row }) => (
          <div className="w-max break-keep px-4 pl-4 capitalize">
            #...{row.getValue<string>("id").slice(-6)}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "customerName",
        header: () => (
          <div className="w-max break-keep px-4">Customer Name</div>
        ),
        cell: ({ row }) => (
          <div className="w-max break-keep px-4 capitalize">
            {row.getValue("customerName")}
          </div>
        ),
        enableSorting: true,
      },

      {
        accessorKey: "quantity",
        header: () => <div className="w-max break-keep px-4">Quantity</div>,
        cell: ({ row }) => (
          <div className="w-max break-keep px-4 capitalize">
            {row.getValue("quantity")}
          </div>
        ),
      },
      {
        accessorKey: "total",
        header: () => <div className="w-max break-keep px-4">Amount</div>,
        cell: ({ row }) => {
          const total = parseFloat(row.getValue("total"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "NPR",
            notation: "compact",
            compactDisplay: "short",
          }).format(total);

          return <div className="px-6 font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "createdAt",
        header: () => <div className="w-max break-keep px-4">Ordered Date</div>,
        cell: ({ row }) => (
          <div className="space-y-1 px-4">
            <p className="w-max break-keep">
              {formatDate(
                new Date(row.getValue("createdAt") ?? new Date()),
                "dd MMM, yyyy",
              )}
            </p>
          </div>
        ),
        enableSorting: true,
      },
    ],
    [],
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: ordersData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  React.useEffect(() => {
    if (isError) {
      toast({
        title: "Something went wrong while getting orders. Try again later.",
        variant: "destructive",
      });
    }
  }, [isError]);

  const { data: bookingsDetails, isLoading: bookingsDetailsLoading } =
    api.business.getBookingsDetails.useQuery(
      {
        businessId: vendor?.id ?? "",
      },
      {
        enabled: !!vendor?.id,
        refetchOnWindowFocus: false,
      },
    );

  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full">
      {!bookingsDetailsLoading && bookingsDetails !== undefined && (
        <Bookings
          open={open}
          setOpen={setOpen}
          paymentDetails={{
            merchantCode: vendor?.merchantCode ?? null,
          }}
          bookingsDetails={bookingsDetails}
          fromVendor={true}
          vendorId={vendor?.id ?? ""}
        />
      )}
      <div className="mx-auto">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1">
            <Input
              placeholder="Filter names..."
              value={
                (table.getColumn("customer")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("customer")?.setFilterValue(event.target.value)
              }
              className="h-10 max-w-sm"
            />
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant={"secondary"}
              size="sm"
              disabled={bookingsDetailsLoading}
              onClick={() => {
                if (!bookingsDetailsLoading && bookingsDetails !== undefined) {
                  setOpen(true);
                }
              }}
            >
              <Plus size={16} className="mr-1" />
              Add Order
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table className="relative">
            <TableHeader className="bg-slate-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="px-4">
                  {headerGroup.headers.map((header) => {
                    return (
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="p-4">
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
                      </TableRow>
                    ))}
                </>
              ) : ordersData.length ? (
                <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="h-14"
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
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
                    className="h-48 text-center"
                  >
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
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
      </div>
    </div>
  );
};

export default AccessoriesOrdersTable;
