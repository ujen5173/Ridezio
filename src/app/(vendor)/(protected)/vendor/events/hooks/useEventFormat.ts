import { add, format, isBefore, parseISO } from "date-fns";
import { type Event } from "~/types/events";

export interface FormattedEvent {
  today: Event[];
  tomorrow: Event[];
  past: Record<string, Event[]>;
  future: Record<string, Event[]>;
}

/**
 * Formats an array of events into categories: today, tomorrow, past, and future
 * @param events Array of events to format
 * @returns FormattedEvent object with categorized events
 */
const useEventFormat = (events: Event[]): FormattedEvent => {
  const now = new Date();
  const tomorrow = add(now, { days: 1 });
  const todayStr = format(now, "yyyy-MM-dd");
  const tomorrowStr = format(tomorrow, "yyyy-MM-dd");

  const initialAcc: FormattedEvent = {
    today: [],
    tomorrow: [],
    past: {},
    future: {},
  };

  return events.reduce((acc, event) => {
    const eventDate = parseISO(event.starting_time);
    const dateKey = format(eventDate, "yyyy-MM-dd");

    // Handle today's events
    if (dateKey === todayStr) {
      acc.today.push(event);
      return acc;
    }

    // Handle tomorrow's events
    if (dateKey === tomorrowStr) {
      acc.tomorrow.push(event);
      return acc;
    }

    // Handle past and future events
    if (isBefore(eventDate, now)) {
      acc.past[dateKey] = acc.past[dateKey] ?? [];
      acc.past[dateKey].push(event);
    } else {
      acc.future[dateKey] = acc.future[dateKey] ?? [];
      acc.future[dateKey].push(event);
    }

    return acc;
  }, initialAcc);
};

export default useEventFormat;
