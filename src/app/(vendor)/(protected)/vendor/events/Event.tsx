import { format, parseISO } from "date-fns";
import { ChartNoAxesCombined, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { type Event } from "~/types/events";

const Event = ({ label, event }: { label: string; event: Event[] }) => {
  return (
    <div className="card relative mb-4 py-2 pl-8">
      <div className="absolute left-0 top-3.5 size-5 rounded-full border border-border bg-white" />
      <div className="line absolute left-2.5 top-9 h-full w-1 border-l border-dashed border-gray-300" />
      <div className="mb-2 flex items-center gap-2">
        <h1 className="text-xl font-semibold text-secondary">{label}</h1>
        <h2 className="text-xl text-slate-700 underline underline-offset-4">
          {format(
            parseISO(event[0]?.starting_time ?? new Date().toISOString()),
            "EEEE",
          )}
        </h2>
      </div>
      {event.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="mb-4 flex w-full items-center gap-6 rounded-xl border border-border bg-slate-50 p-4 shadow-sm last:mb-0 hover:border-border">
      <div className="flex-[2]">
        <h2 className="text-lg text-gray-500">
          {format(parseISO(event.starting_time), "h:mm a")} -{" "}
          {format(parseISO(event.ending_time), "h:mm a")}
        </h2>

        <h1 className="mb-4 text-2xl font-bold leading-snug text-slate-700">
          {event.title}
        </h1>

        <div className="flex items-center gap-4">
          <h3 className="mb-2 text-lg text-gray-500">
            Type: <span className="capitalize">{event.type}</span>
          </h3>
          <h3 className="mb-2 text-lg text-gray-500">
            Participants: {event.participants.length}
          </h3>
          <h3 className="mb-2 text-lg text-gray-500">
            Medium: <span className="capitalize">{event.medium}</span>
          </h3>
        </div>

        <div className="mb-4 flex items-center gap-1">
          <MapPin color="#64748b" size={20} />
          <span className="text-lg font-medium text-gray-500">
            {event.address}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"outline"} size="sm">
            Manage Event
            <ChevronRight size={15} className="mb-1 ml-1" />
          </Button>
          <Button variant={"destructive"} size="sm">
            Analytics
            <ChartNoAxesCombined size={15} className="mb-1 ml-1" />
          </Button>
        </div>
      </div>

      <div className="flex h-fit flex-1 justify-end">
        <Image
          src={event.cover_image}
          alt={event.title}
          width={500}
          height={100}
          className="aspect-video w-72 rounded-xl object-cover"
        />
      </div>
    </div>
  );
};

export default Event;
