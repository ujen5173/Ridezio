"use client";
import { Clock, Moon } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { WEEK_DAYS } from "~/app/utils/helpers";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import type { GetCurrentBusinessType } from "~/server/api/routers/business";
import { type formSchema } from "../BusinessProfile";

const BusinessHours = ({ business }: { business: GetCurrentBusinessType }) => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  const timeOptionsForAM = useMemo(() => {
    const options = [];
    for (let hour = 5; hour <= 12; hour++) {
      options.push(`${hour}:00 AM`);
    }
    return options;
  }, []);

  const timeOptionsForPM = useMemo(() => {
    const options = [];
    for (let hour = 13; hour <= 20; hour++) {
      options.push(`${hour % 12}:00 PM`);
    }
    return options;
  }, []);

  const [isBusinessHourEnabled, setIsBusinessHourEnabled] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(
      WEEK_DAYS.map((day) => [day, business!.businessHours?.[day] !== null]),
    ),
  );

  const handleBusinessHourChange = (
    day: string,
    field: "open" | "close",
    value: string | null,
  ) => {
    form.setValue("businessHours", {
      ...form.getValues("businessHours"),
      [day]: {
        ...(form.getValues("businessHours")[day] ?? {
          open: "9:00 AM",
          close: "6:00 PM",
        }),
        [field]: value,
      },
    });
  };

  const handleBusinessHourEnable = (day: string, enabled: boolean) => {
    setIsBusinessHourEnabled((prev) => ({
      ...prev,
      [day]: enabled,
    }));

    if (!enabled) {
      form.setValue("businessHours", {
        ...form.getValues("businessHours"),
        [day]: null,
      });
    } else {
      form.setValue("businessHours", {
        ...form.getValues("businessHours"),
        [day]: { open: "9:00 AM", close: "6:00 PM" },
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name="businessHours"
      render={() => (
        <FormItem>
          <FormLabel>Working Days and time</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="w-full overflow-x-auto border-b border-border py-4 lg:w-[calc(100%/2-1.5rem)]"
                >
                  <div className="flex w-full flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <Switch
                        aria-readonly
                        checked={isBusinessHourEnabled[day]}
                        onCheckedChange={(enabled) =>
                          handleBusinessHourEnable(day, enabled)
                        }
                      />
                      <span className="text-base font-semibold text-slate-600">
                        {day}
                      </span>
                    </div>

                    {isBusinessHourEnabled[day] ? (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <div>
                            <Select
                              defaultValue={
                                isBusinessHourEnabled[day]
                                  ? (form.getValues("businessHours")[day]
                                      ?.open ?? "6:00 AM")
                                  : undefined
                              }
                              onValueChange={(value) =>
                                handleBusinessHourChange(day, "open", value)
                              }
                            >
                              <SelectTrigger className="w-[120px] font-normal focus:ring-0">
                                <div className="flex items-center gap-1">
                                  <Clock size={16} className="text-slate-700" />
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-[15rem]">
                                  {timeOptionsForAM.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </div>
                        <span>to</span>
                        <div className="flex flex-col">
                          <div>
                            <Select
                              defaultValue={
                                isBusinessHourEnabled[day]
                                  ? (form.getValues("businessHours")[day]
                                      ?.close ?? "7:00 PM")
                                  : undefined
                              }
                              onValueChange={(value) =>
                                handleBusinessHourChange(day, "close", value)
                              }
                            >
                              <SelectTrigger className="w-[120px] font-normal focus:ring-0">
                                <Clock size={16} className="text-slate-700" />
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-[15rem]">
                                  {timeOptionsForPM.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-6">
                        <Moon size={16} className="text-slate-500" />
                        <span className="text-sm italic text-slate-500">
                          No Working on this day
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default BusinessHours;
