export type Event = {
  id: number;
  cover_image: string;
  title: string;
  slug: string;
  hosted_by: string;
  starting_time: string;
  ending_time: string;
  medium: "virtual" | "in-person";
  type: "competition" | "meetup" | "event";
  about: string;
  participants: {
    id: string;
    profile: string;
  }[];
  address: string;
  created_at: string;
};

export type FormattedEvent = {
  today: Event[];
  tomorrow: Event[];
  past: Event[];
  invalid: Event[];
} & Record<string, Event[]>;
