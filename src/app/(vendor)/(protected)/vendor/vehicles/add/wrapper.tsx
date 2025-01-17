"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {} from "cmdk";
import { Check, ChevronsUpDown, Loader, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FileUploaderWrapper from "~/app/_components/_/FileUploaderWrapper";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/hooks/use-toast";
import { useUploadFile } from "~/hooks/useUploadthing";
import { cn } from "~/lib/utils";
import { VEHICLE_CATEGORY } from "~/lib/vehicle-category";
import { vehicleTypeEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";

type EditData = {
  id: string;
  name: string;
  category: string;
  type: (typeof vehicleTypeEnum.enumValues)[number];
  inventory: number;
  basePrice: number;
  images: {
    id: string;
    order: number;
    url: string;
  }[];
  features: { key: string; value: string }[];
};

const formSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  type: z.enum(vehicleTypeEnum.enumValues).optional(),
  inventory: z.number().min(1),
  basePrice: z.number().min(100),
  features: z.array(z.object({ key: z.string(), value: z.string() })),
  images: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      url: z.string(),
    }),
  ),
});

const imageSchema = z.object({
  images: z
    .object({
      id: z.string(),
      url: z.string().url(),
      order: z.number(),
    })
    .array(),
});

const Wrapper = ({
  editData,
  allowedVehicles,
  type,
}: {
  allowedVehicles: (typeof vehicleTypeEnum.enumValues)[number][];
  type: "edit" | "new";
  editData: EditData | undefined;
}) => {
  const router = useRouter();

  const { data: business } = api.business.current.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { mutateAsync, status } = api.vehicle.create.useMutation();
  const [features, setFeatures] = useState<{ key: string; value: string }[]>(
    editData?.features ?? [],
  );

  const [files, setFiles] = useState<File[] | null>([]);

  const { uploadFiles, uploadedFile, isUploading } = useUploadFile(
    "imageUploader",
    {},
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editData?.name ?? "",
      category: editData?.category ?? "",
      type: editData?.type ?? undefined,
      features: editData?.features ?? [],
      inventory: editData?.inventory ?? 1,
      basePrice: editData?.basePrice ?? 0,
      images: [],
    },
  });

  const imageForm = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    mode: "onBlur",
    defaultValues: {
      images: editData?.images ?? [],
    },
  });

  const images = imageForm.watch("images") || [];

  console.log({ images });

  useEffect(() => {
    if (uploadedFile && uploadedFile.length > 0) {
      imageForm.setValue(
        "images",
        uploadedFile.map((e, idx) => ({
          id: e.key,
          order: idx,
          url: e.url,
        })),
      );
    }
  }, [uploadedFile, imageForm]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!business) {
      toast({
        title: "No business found",
        variant: "destructive",
      });
      return;
    }

    if (values.type === undefined) {
      toast({
        title: "Please select a vehicle type",
        variant: "destructive",
      });
      return;
    }

    const { inventory, ...rest } = values;

    if (images.length === 0) {
      toast({
        title: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    await mutateAsync({
      data: {
        ...rest,
        features,
        inventory: inventory,
        images: images,
        businessId: business.id,
      },
      type,
      editId: editData?.id,
    });

    toast({
      title: `Vehicle ${type === "edit" ? "updated" : "added"} successfully`,
    });

    router.push("/vendor/vehicles");
  }

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Vehicle</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex w-full flex-col gap-10 space-y-2 lg:flex-row">
            <div className="flex-[2]">
              <FormLabel className="text-slate-600">
                Media (Upload vehicle images)
              </FormLabel>

              <div className="mb-4">
                <FileUploaderWrapper
                  files={files}
                  setFiles={setFiles}
                  onFileUpload={uploadFiles}
                  uploadedFile={uploadedFile}
                  isUploading={isUploading}
                  images={images}
                  form={imageForm}
                  recommendedSize="800 x 522"
                />
              </div>
            </div>
            <div className="flex-[3] space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">
                        Vehicle Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Porsche 911 GT3 RS" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="text-slate-600">
                          Vehicle Category
                        </FormLabel>
                        <FormControl>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between px-4"
                              >
                                {field.value
                                  ? field.value
                                  : "Select category..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0"
                              align="start"
                            >
                              <Command className="w-full">
                                <CommandInput placeholder="Search category..." />
                                <ScrollArea className="h-80 w-full">
                                  <CommandList>
                                    <CommandEmpty>
                                      No category found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {Object.entries(VEHICLE_CATEGORY)
                                        .filter((e) => {
                                          if (allowedVehicles.length > 0) {
                                            return allowedVehicles.includes(
                                              e[0] as (typeof vehicleTypeEnum.enumValues)[number],
                                            );
                                          }
                                          return true;
                                        })
                                        .map(
                                          ([type, categories], typeIndex) => (
                                            <div key={type}>
                                              <CommandItem
                                                className="px-2 py-1.5 font-semibold uppercase text-slate-950"
                                                disabled
                                              >
                                                {type}
                                              </CommandItem>
                                              {categories.map((category) => (
                                                <CommandItem
                                                  key={category}
                                                  value={category}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      field.name,
                                                      category,
                                                    );
                                                    form.setValue(
                                                      "type",
                                                      (category.includes(
                                                        "Electric",
                                                      )
                                                        ? `e-${type}`
                                                        : type) as (typeof vehicleTypeEnum.enumValues)[number],
                                                    );
                                                    setOpen(false);
                                                  }}
                                                  className="pl-4"
                                                >
                                                  {category}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto h-4 w-4",
                                                      field.value === category
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                              {typeIndex !==
                                                Object.entries(VEHICLE_CATEGORY)
                                                  .length -
                                                  1 && (
                                                <Separator className="my-1" />
                                              )}
                                            </div>
                                          ),
                                        )}
                                    </CommandGroup>
                                  </CommandList>
                                </ScrollArea>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">
                        Inventory
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            form.setValue(field.name, +e.target.value);
                          }}
                          placeholder="3"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">
                        Base Price (per day)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            form.setValue(field.name, +e.target.value);
                          }}
                          placeholder="500"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Add Vehicle Features</Label>
                <div className="mb-2 space-y-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex flex-1 gap-2">
                        <Input
                          value={feature.key}
                          className="h-10"
                          placeholder="Property"
                          autoFocus
                          onChange={(e) => {
                            const updatedFeatures = [...features];
                            if (updatedFeatures[idx]) {
                              updatedFeatures[idx].key = e.target.value;
                              setFeatures(updatedFeatures);
                            }
                          }}
                        />
                        <Input
                          value={feature.value}
                          className="h-10"
                          placeholder="Value"
                          onChange={(e) => {
                            const updatedFeatures = [...features];
                            if (updatedFeatures[idx]) {
                              updatedFeatures[idx].value = e.target.value;
                              setFeatures(updatedFeatures);
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant={"outline"}
                        onClick={() => {
                          const updatedFeatures = [...features];
                          updatedFeatures.splice(idx, 1);
                          setFeatures(updatedFeatures);
                        }}
                      >
                        <Trash size={15} className="text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    setFeatures([...features, { key: "", value: "" }]);
                  }}
                  type="button"
                  size="sm"
                  variant={"outline"}
                >
                  <Plus size={15} className="mr-1 text-slate-600" />
                  Add Feature
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  disabled={status === "pending"}
                  type="button"
                  variant={"outline"}
                >
                  Cancel
                </Button>

                <Button disabled={status === "pending"} variant={"primary"}>
                  {status === "pending" ? (
                    <>
                      <Loader className="mr-2 animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Wrapper;
