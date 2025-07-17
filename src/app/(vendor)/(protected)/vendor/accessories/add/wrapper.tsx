"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { InputTags as TagsInput } from "~/components/ui/tags-input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { useCloudinaryUpload } from "~/hooks/useCloudinaryUpload";
import { cn } from "~/lib/utils";
import { ACCESSORIES_CATEGORY } from "~/lib/vehicle-category";
import { type GetSingleAccessoriesType } from "~/server/api/routers/accessories";
import { vehicleTypeEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  sizes: z.string().array().default([]).optional(),
  colors: z.string().array().default([]).optional(),
  type: z.enum(vehicleTypeEnum.enumValues).optional(),
  inventory: z.number().min(1, "Inventory must be at least 1"),
  basePrice: z.number().min(50, "Base price must be at least 50"),
  discount: z.number().optional(),
  description: z.string().optional(),
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

type WrapperProps = {
  type: "edit" | "new";
  editData?: GetSingleAccessoriesType;
};

const Wrapper = ({ editData, type }: WrapperProps) => {
  const router = useRouter();
  const { data: business } = api.business.current.useQuery();
  const { mutateAsync, status } = api.accessories.create.useMutation();

  const [files, setFiles] = useState<File[] | null>([]);
  const { uploadToCloudinary, uploadedFiles, isUploading } =
    useCloudinaryUpload();

  const defaultV = {
    name: editData?.name ?? "",
    category: editData?.category ?? "",
    sizes: editData?.sizes ?? [],
    colors: editData?.colors ?? [],
    inventory: editData?.inventory ?? 1,
    brand: editData?.brand ?? "",
    discount: editData?.discount ?? 0,
    basePrice: editData?.basePrice ?? 0,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultV,
  });

  const imageForm = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    mode: "onBlur",
    defaultValues: useMemo(
      () => ({
        images: editData?.images ?? [],
      }),
      [editData],
    ),
  });

  const images = imageForm.watch("images") || [];

  const handleFileUpload = useCallback(
    async (files: File[]) => {
      setFiles(files);
      await uploadToCloudinary(files);
    },
    [uploadToCloudinary],
  );

  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
    async (values) => {
      if (!business) {
        toast({ title: "No business found", variant: "destructive" });
        return;
      }
      if (!images.length) {
        toast({
          title: "Please upload at least one image",
          variant: "destructive",
        });
        return;
      }
      if (!values.category) {
        toast({ title: "Please select a category", variant: "destructive" });
        return;
      }
      await mutateAsync({
        data: { ...values, images },
        editId: editData?.id,
      });
      toast({
        title: `Accessories ${type === "edit" ? "updated" : "added"} successfully`,
      });
      router.push("/vendor/accessories");
    },
    [business, images, mutateAsync, editData, type, router],
  );

  return (
    <div className="w-full p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {type === "edit" ? "Edit Accessory" : "New Accessories"}
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 pb-10 md:pb-0"
        >
          <div className="flex w-full flex-col gap-10 space-y-2 lg:flex-row">
            {/* Image Upload */}
            <div className="flex-[2]">
              <FormLabel className="text-slate-600">
                Media (Upload accessories images)
              </FormLabel>
              <div className="mb-4">
                <FileUploaderWrapper
                  files={files}
                  form={imageForm}
                  images={images}
                  setFiles={setFiles}
                  onFileUpload={handleFileUpload}
                  uploadedFiles={uploadedFiles}
                  isUploading={isUploading}
                />
              </div>
            </div>
            {/* Form Fields */}
            <div className="flex-[3] space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">
                        Accessory Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Night Light" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">
                        Accessory Category
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
                              {field.value || "Select category..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command className="w-full">
                              <CommandInput placeholder="Search category..." />
                              <ScrollArea className="h-80 w-full">
                                <CommandList>
                                  <CommandEmpty>
                                    No category found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {ACCESSORIES_CATEGORY.map((cat) => (
                                      <CommandItem
                                        key={cat}
                                        value={cat}
                                        onSelect={() => {
                                          form.setValue("category", cat);
                                          setOpen(false);
                                        }}
                                        className="pl-4"
                                      >
                                        {cat}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            field.value === cat
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
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
                          onChange={(e) =>
                            form.setValue("inventory", +e.target.value)
                          }
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
                          onChange={(e) =>
                            form.setValue("basePrice", +e.target.value)
                          }
                          placeholder="500"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">Brand</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nike"
                          type="text"
                          onChange={(e) =>
                            form.setValue("brand", e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">Discount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            form.setValue("discount", +e.target.value)
                          }
                          placeholder="500"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">Sizes</FormLabel>
                      <FormControl>
                        <TagsInput
                          type="text"
                          {...field}
                          value={field.value ?? []}
                          onChange={field.onChange}
                          placeholder="S, M, L"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">Colors</FormLabel>
                      <FormControl>
                        <TagsInput
                          type="text"
                          {...field}
                          value={field.value ?? []}
                          onChange={field.onChange}
                          placeholder="White, Black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="h-40"
                        placeholder="A short and brief description of the accessory"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => router.back()}
                  disabled={status === "pending"}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={status === "pending"}
                  variant="primary"
                >
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
