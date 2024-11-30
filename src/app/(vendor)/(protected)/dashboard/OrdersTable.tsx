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
import { Check, Loader, Plus, RefreshCcw, Trash } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import Bookings from "~/app/(normal-user)/(others)/vendor/[slug]/_components/Bookings";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
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
import { type GetOrdersType } from "~/server/api/routers/business";
import { type rentalStatusEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";

export type Order = Omit<GetOrdersType[0], "notes" | "date"> & {};

// This function is just to transform the data from the API to the format that the table expects

const transformApiData = (data: GetOrdersType = []): Order[] =>
  data.map((vehicle) => ({
    order: vehicle.order,
    customer: vehicle.customer,
    payment: vehicle.payment,
    payment_ss: vehicle.payment_ss,
    status: vehicle.status,
    vehicle: vehicle.vehicle,
    vehicle_type: vehicle.vehicle_type,
    quantity: vehicle.quantity,
    num_of_days: vehicle.num_of_days,
    amount: vehicle.amount,
    createdAt: vehicle.createdAt,
  }));

const OrdersTable = () => {
  const { data: vendor } = api.business.current.useQuery();
  const { mutateAsync, status } = api.rental.updatedStatus.useMutation();
  const {
    data: ordersData = [],
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = api.business.getOrders.useQuery();

  const columns: ColumnDef<Order>[] = React.useMemo(
    () => [
      {
        accessorKey: "order",
        header: () => <div className="w-max break-keep px-4 pl-4">UUID</div>,
        cell: ({ row }) => (
          <div className="w-max break-keep px-4 pl-4 capitalize">
            #...{row.getValue<string>("order").slice(-6)}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "customer",
        header: () => <div className="w-max break-keep px-4">Customer</div>,
        cell: ({ row }) => (
          <div className="w-max break-keep px-4 capitalize">
            {row.getValue("customer")}
          </div>
        ),
        enableSorting: true,
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
      {
        accessorKey: "payment",
        header: () => <div className="w-max break-keep px-4">Payment</div>,
        cell: ({ row }) => (
          <div className="w-max break-keep px-4 capitalize">
            {row.getValue("payment")}
          </div>
        ),
      },
      {
        id: "vehicle",
        header: () => <div className="w-max break-keep px-4">Vehicles</div>,
        accessorFn: (row) => ({
          vehicle: row.vehicle,
          vehicle_type: row.vehicle_type,
        }),
        cell: ({ row }) => {
          const value = row.getValue<{
            vehicle: string;
            vehicle_type: string;
          }>("vehicle");
          return (
            <div className="flex w-max items-center gap-2 break-keep px-4 capitalize">
              {value.vehicle}
              <div
                className={cn(
                  "border border-green-400 bg-green-50 text-green-600",
                  "w-fit break-keep rounded-sm px-2 py-1 text-center text-xs font-semibold capitalize",
                )}
              >
                {value.vehicle_type}
              </div>
            </div>
          );
        },
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
        accessorKey: "num_of_days",
        header: () => <div className="w-max break-keep px-4">No of Days</div>,
        cell: ({ row }) => (
          <div className="w-max break-keep px-4 capitalize">
            {row.getValue("num_of_days")}
          </div>
        ),
      },
      {
        accessorKey: "payment_ss",
        header: () => <div className="w-max break-keep px-4">Payment SS</div>,
        cell: ({ row }) => (
          <div className="w-max break-keep px-4 capitalize">
            {row.getValue("payment_ss") ? (
              <div className="">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      <Image
                        src={row.getValue("payment_ss")}
                        alt="Payment Screenshot missing..."
                        width={100}
                        height={200}
                        className="w-10 rounded-sm object-cover"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <div className="py-8">
                      <Image
                        src={row.getValue("payment_ss")}
                        alt="Payment Screenshot missing..."
                        width={1440}
                        height={840}
                        className="mx-auto h-[70vh] max-h-[42rem] min-h-[30rem] w-auto rounded-md object-cover"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              "N/A"
            )}
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <div className="w-max break-keep px-4">Amount</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "NPR",
            notation: "compact",
            compactDisplay: "short",
          }).format(amount);

          return <div className="px-6 font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="w-max break-keep px-4">Status</div>,
        cell: ({ row }) => (
          <div
            className={cn(
              row.getValue<(typeof rentalStatusEnum.enumValues)[number]>(
                "status",
              ) === "approved" &&
                "border border-green-400 bg-green-50 text-green-600",
              row.getValue<(typeof rentalStatusEnum.enumValues)[number]>(
                "status",
              ) === "pending" &&
                "border border-yellow-400 bg-yellow-50 text-yellow-600",
              row.getValue<(typeof rentalStatusEnum.enumValues)[number]>(
                "status",
              ) === "rejected" &&
                "border border-red-400 bg-red-50 text-red-600",
              "w-20 break-keep rounded-sm px-2 py-1 text-center text-xs capitalize",
            )}
          >
            {row.getValue<(typeof rentalStatusEnum.enumValues)[number]>(
              "status",
            )}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => (
          <div className="ml-auto w-max break-keep px-4 pr-4 text-right">
            Actions
          </div>
        ),

        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-end gap-2 px-4 pr-4">
              <Button
                variant={"outline"}
                size="sm"
                onClick={async () => {
                  await mutateAsync({
                    orderId: row.getValue<string>("order"),
                    status: "approved",
                  });

                  toast({
                    title: `Order has been accepted.`,
                  });
                  void refetch();
                }}
                disabled={
                  row.getValue<(typeof rentalStatusEnum.enumValues)[number]>(
                    "status",
                  ) === "approved"
                }
                className="gap-1 text-green-700"
              >
                <Check size={15} className="text-green-600" />
                Accept
              </Button>
              <Button
                onClick={async () => {
                  await mutateAsync({
                    orderId: row.getValue<string>("order"),
                    status: "rejected",
                  });

                  toast({
                    title: `Order has been rejected.`,
                  });
                  void refetch();
                }}
                variant={"outline"}
                size="sm"
                disabled={
                  row.getValue<(typeof rentalStatusEnum.enumValues)[number]>(
                    "status",
                  ) === "rejected"
                }
                className="gap-1 text-red-700"
              >
                <Trash size={15} className="text-red-600" />
                Reject
              </Button>
            </div>
          );
        },
      },
    ],
    [mutateAsync, status],
  );

  const orders = React.useMemo(
    () => transformApiData(ordersData),
    [ordersData],
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: orders,
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
          bookingsDetails={bookingsDetails}
          paymentMethod={"PhonePay"}
          paymentId={"98xxxxxxxx"}
        />
      )}
      <div className="max-w-1440px mx-auto">
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
              variant={"outline"}
              size="sm"
              onClick={() => void refetch()}
            >
              {isRefetching ? (
                <Loader size={16} className="mr-1 animate-spin" />
              ) : (
                <RefreshCcw size={16} className="mr-1" />
              )}
              {isRefetching ? "Refreshing" : "Refresh"}
            </Button>
            <Button
              variant={"secondary"}
              size="sm"
              onClick={() => setOpen(true)}
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
              {isLoading || isRefetching ? (
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
              ) : orders.length ? (
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

export default OrdersTable;
