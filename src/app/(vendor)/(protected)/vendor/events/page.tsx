"use client";

import { format, parseISO } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { eventsData } from "./data";
import Event from "./Event";
import useEventFormat from "./hooks/useEventFormat";

const Events = () => {
  const [tab, setTab] = useState<"upcomming" | "past">("upcomming");
  const { today, tomorrow, past, future } = useEventFormat(eventsData);

  return (
    <section className="w-full px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-700">Events</h1>
        <div className="flex items-center gap-2">
          <Link href={`/vendor/events/add`}>
            <Button size="sm" variant="secondary">
              <Plus className="mr-1" size={15} />
              Create Event
            </Button>
          </Link>

          <div className="flex rounded-sm bg-slate-200 p-0.5 shadow-sm">
            <Button
              variant={"outline"}
              rounded={"sm"}
              onClick={() => setTab("upcomming")}
              size="sm"
              className={cn(
                "h-7",
                tab === "upcomming"
                  ? "border-transparent hover:bg-white"
                  : "border-none bg-transparent text-slate-600 shadow-none hover:bg-transparent hover:text-slate-800",
              )}
            >
              Upcomming
            </Button>
            <Button
              variant={"outline"}
              rounded={"sm"}
              onClick={() => setTab("past")}
              size="sm"
              className={cn(
                "h-7 w-20",
                tab === "past"
                  ? "border-transparent hover:bg-white"
                  : "border-none bg-transparent text-slate-600 shadow-none hover:bg-transparent hover:text-slate-800",
              )}
            >
              Past
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={tab} className="w-full">
        <TabsContent value="upcomming">
          <main>
            {today.length > 0 && <Event label="Today" event={today} />}

            {tomorrow.length > 0 && <Event label="Tomorrow" event={tomorrow} />}

            {[...Object.entries(future)].length > 0 && (
              <div>
                {[...Object.entries(future)].map((event, index) => {
                  return (
                    <Event
                      key={index}
                      label={format(
                        parseISO(event[0] ?? new Date().toISOString()),
                        "EEEE, MMM dd, yyyy",
                      )}
                      event={event[1]}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </TabsContent>
        <TabsContent value="past">
          <main>
            {[...Object.entries(past)].length > 0 && (
              <div>
                {[...Object.entries(past)].map((event, index) => {
                  return (
                    <Event
                      key={index}
                      label={format(
                        parseISO(event[0] ?? new Date().toISOString()),
                        "EEEE, MMM dd, yyyy",
                      )}
                      event={event[1]}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Events;
