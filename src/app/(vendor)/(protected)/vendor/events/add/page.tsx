"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, setHours, setMinutes, setSeconds } from "date-fns";
import {
  FilePenLine,
  MapPinCheck,
  NotepadText,
  Ticket,
  Users,
} from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import FileUploaderWrapper from "~/app/_components/_/FileUploaderWrapper";
import { chakra_petch } from "~/app/utils/font";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import DateTimePicker from "~/components/ui/date-time-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { useCloudinaryUpload } from "~/hooks/useCloudinaryUpload";
import { cn } from "~/lib/utils";
import LocationPicker from "./Location";

type Location = {
  address: {
    country: string;
    country_code: string;
    county: string;
    state: string;
    name: string;
  };
  boundingBox: Record<number, string>;
  class: string;
  display_name: string;
  display_place: string;
  lat: string;
  licence: string;
  lon: string;
  osm_id: string;
  place_id: string;
  osm_type: string;
  type: string;
  display_address: string;
};

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is Required",
    })
    .max(255),
  starting_date: z
    .date({
      message: "Please select a valid starting date.",
    })
    .default(new Date()),
  ending_date: z
    .date({
      message: "Please select a valid ending date.",
    })
    .optional(),

  meetup_location: z.string().min(1, {
    message: "Meetup Location is Required",
  }),
  destination_location: z.string().min(1, {
    message: "Destination Location is Required",
  }),
  description: z.string().min(1, {
    message: "Description is Required",
  }),
  fee: z.number().optional(),
  capacity: z.number().optional(),
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

const CreateEvent = () => {
  const [files, setFiles] = useState<File[] | null>([]);

  const start_date = setSeconds(
    setMinutes(setHours(addDays(new Date(), 1), 12), 0),
    0,
  );
  const { uploadToCloudinary, uploadedFiles, isUploading } =
    useCloudinaryUpload();

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    await uploadToCloudinary(files);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      starting_date: start_date,
      ending_date: undefined,
      meetup_location: "",
      destination_location: "",
      description: `Requirements: \nMention any specific prerequisites or materials needed (e.g., "Bring your own laptop and notebook").\n\nTimeline: \nOutline the schedule briefly (e.g., "10:00 AM - Gathering, 11:00 AM - Reaching destination, 1:00 PM - Lunch").\n\nAdditional Info: \nAdd any other details like event location.`,
      fee: 0,
      capacity: 0,
    },
  });

  const imageForm = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    mode: "onBlur",
    defaultValues: {
      images: [],
    },
  });

  const images = imageForm.watch("images") || [];

  const handleLocationSelect = (location: Location) => {
    form.setValue("meetup_location", location.display_place);
    // setLocationAddress(
    //   `${location.address.state ? `${location.address.state}, ` : ""}${location.address.country}`,
    // );
  };

  const handleDestinationSelect = (location: Location) => {
    form.setValue("destination_location", location.display_place);
    // setDestinationLocationAddress(
    //   `${location.address.state ? `${location.address.state}, ` : ""}${location.address.country}`,
    // );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (images.length === 0) {
      toast({
        title: "Please upload a cover image",
      });

      return;
    }

    // create the event
  }

  return (
    <FormProvider {...form}>
      <section className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mx-auto flex w-full max-w-[1200px] gap-10 px-4 py-8">
              <div className="h-96 flex-[2] rounded-lg">
                <FormLabel>Cover Image</FormLabel>
                <div className="">
                  <FileUploaderWrapper
                    files={files}
                    setFiles={setFiles}
                    onFileUpload={handleFileUpload}
                    uploadedFiles={uploadedFiles}
                    isUploading={isUploading}
                    images={images}
                    form={imageForm}
                    dropzone={{
                      accept: {
                        "image/*": [".jpg", ".jpeg", ".png", ".webp"],
                      },
                      multiple: true,
                      maxFiles: 1,
                      maxSize: 1 * 1024 * 1024,
                    }}
                  />
                </div>
              </div>
              <div className="flex-[3]">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          autoFocus
                          {...field}
                          autoCapitalize="on"
                          placeholder="Event Name"
                          className={cn(
                            "mb-4 w-full border-none bg-transparent text-4xl font-semibold text-secondary shadow-none outline-none placeholder:text-secondary/60 focus:ring-0",
                            chakra_petch.className,
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="space-y-1 rounded-sm border border-slate-200 bg-slate-100 p-1 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="w-96 flex-1 font-medium text-slate-700">
                        Start
                      </div>
                      <div className="flex items-center gap-1">
                        <DateTimePicker label={"starting_date"} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-96 flex-1 font-medium text-slate-700">
                        End
                      </div>
                      <div className="flex items-center gap-1">
                        <DateTimePicker label={"ending_date"} />
                      </div>
                    </div>
                  </div>

                  <LocationPicker
                    placeholder="Add Meetup Event Location"
                    onLocationSelect={handleLocationSelect}
                    locationKey="meetup_location"
                  />
                  <LocationPicker
                    placeholder="Add Destination Location"
                    onLocationSelect={handleDestinationSelect}
                    locationKey="destination_location"
                    icon={
                      <MapPinCheck size={18} className="mt-1 text-slate-700" />
                    }
                  />

                  <div className="mb-2 flex items-start gap-2 rounded-sm border border-slate-200 bg-slate-100 p-3">
                    <NotepadText size={18} className="mt-1 text-slate-700" />
                    <div className="w-full">
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
                                className="h-64 w-full bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg">Event Options</Label>
                    <div className="space-y-1 rounded-sm border border-slate-200 bg-slate-100 p-1 px-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div
                            role="button"
                            className="flex items-center justify-between gap-2 py-3"
                          >
                            <div className="flex items-center gap-2">
                              <Ticket size={18} className="text-slate-700" />
                              <h3 className="text-lg text-slate-500">Fee</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg text-slate-500">
                                {form.getValues("fee")
                                  ? `${form.getValues("fee")} people`
                                  : "Free"}
                              </h3>
                              <FilePenLine
                                size={18}
                                className="text-slate-700"
                              />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <AlertDialogHeader>
                            <DialogTitle>Registration Fee</DialogTitle>
                            <DialogDescription>
                              People will need to pay to attend this event. This
                              will be set to free if not added.
                            </DialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <FormField
                              control={form.control}
                              name="fee"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-600">
                                    Fee
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      min={50}
                                      {...field}
                                      onChange={(e) => {
                                        const fee = +e.target.value;
                                        form.setValue("fee", fee);
                                      }}
                                      type="number"
                                      placeholder="500"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <AlertDialogFooter className="gap-1">
                            <DialogClose>
                              <Button type="submit" variant={"primary"}>
                                Set Registration Fee
                              </Button>
                            </DialogClose>
                            <DialogClose>
                              <Button type="reset" variant={"outline"}>
                                Remove Fee
                              </Button>
                            </DialogClose>
                          </AlertDialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Separator />

                      <Dialog>
                        <DialogTrigger asChild>
                          <div
                            role="button"
                            className="flex items-center justify-between gap-2 py-3"
                          >
                            <div className="flex items-center gap-2">
                              <Users size={18} className="text-slate-700" />
                              <h3 className="text-lg text-slate-500">
                                Capacity
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg text-slate-500">
                                {form.getValues("capacity")
                                  ? `${form.getValues("capacity")} people`
                                  : "Unlimited"}
                              </h3>
                              <FilePenLine
                                size={18}
                                className="text-slate-700"
                              />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <AlertDialogHeader>
                            <DialogTitle>Max Capacity</DialogTitle>
                            <DialogDescription>
                              Auto-close registration when the capacity is
                              reached. Only approved guests count toward the
                              cap.
                            </DialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <FormField
                              control={form.control}
                              name="capacity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-600">
                                    Capacity
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      min={1}
                                      {...field}
                                      onChange={(e) => {
                                        const fee = +e.target.value;
                                        form.setValue("capacity", fee);
                                      }}
                                      id={"capacity"}
                                      placeholder="100"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <AlertDialogFooter className="gap-1">
                            <DialogClose>
                              <Button type="submit" variant={"primary"}>
                                Set Limit
                              </Button>
                            </DialogClose>
                            <DialogClose>
                              <Button type="reset" variant={"outline"}>
                                Remove Limit
                              </Button>
                            </DialogClose>
                          </AlertDialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <Button
                    variant={"secondary"}
                    type="submit"
                    onClick={() => {
                      void onSubmit(form.getValues());
                    }}
                    className="w-full"
                  >
                    Create Event
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </section>
    </FormProvider>
  );
};

export default CreateEvent;
