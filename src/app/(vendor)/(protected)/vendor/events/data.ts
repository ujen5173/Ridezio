import { addDays, addHours, format, subDays } from "date-fns";
import { type Event } from "~/types/events";

const now = new Date();
const tomorrow = addDays(now, 1);

export const eventsData: Event[] = [
  {
    id: 1,
    cover_image: "/images/events/img-event-1.webp",
    title: "Winter Code Sprint 2024",
    slug: "winter-code-sprint-2024",
    hosted_by: "Sarah Chen",
    starting_time: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    ending_time: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    medium: "virtual",
    type: "event",
    about:
      "A six-hour coding challenge focused on building innovative AI solutions.",
    participants: [
      { id: "101", profile: "/images/profiles/user1.webp" },
      { id: "102", profile: "/images/profiles/user2.webp" },
    ],
    address: "Tech Hub, San Francisco",
    created_at: "2023-12-01T08:00:00Z",
  },
  {
    id: 2,
    cover_image: "/images/events/img-event-2.webp",
    title: "AI Ethics Workshop",
    slug: "ai-ethics-workshop",
    hosted_by: "Dr. Michael Roberts",
    starting_time: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    ending_time: format(addHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    medium: "in-person",
    type: "event",
    about: "Interactive session on ethical considerations in AI development.",
    participants: [
      { id: "201", profile: "/images/profiles/user4.webp" },
      { id: "202", profile: "/images/profiles/user5.webp" },
    ],
    address: "University Center, Boston",
    created_at: "2023-12-15T10:00:00Z",
  },
  {
    id: 3,
    cover_image: "/images/events/img-event-3.jpg",
    title: "Tech Networking Mixer",
    slug: "tech-networking-mixer",
    hosted_by: "Lisa Wong",
    starting_time: format(tomorrow, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    ending_time: format(addHours(tomorrow, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    medium: "in-person",
    type: "event",
    about: "Connect with tech professionals over drinks and discussions.",
    participants: [
      { id: "301", profile: "/images/profiles/user6.webp" },
      { id: "302", profile: "/images/profiles/user7.webp" },
    ],
    address: "Startup Lounge, Austin",
    created_at: "2023-12-18T15:00:00Z",
  },
  {
    id: 4,
    cover_image: "/images/events/img-event-4.jpg",
    title: "Web3 Development Conference",
    slug: "web3-development-conference",
    hosted_by: "Alex Johnson",
    starting_time: "2024-12-28T09:00:00Z",
    ending_time: "2024-12-28T17:00:00Z",
    medium: "virtual",
    type: "event",
    about: "Full-day virtual conference on the latest in Web3 development.",
    participants: [
      { id: "401", profile: "/images/profiles/user10.webp" },
      { id: "402", profile: "/images/profiles/user11.webp" },
    ],
    address: "Virtual Event",
    created_at: "2023-12-10T12:00:00Z",
  },
  {
    id: 5,
    cover_image: "/images/events/img-event-2.webp",
    title: "Mobile App Development Bootcamp",
    slug: "mobile-app-development-bootcamp",
    hosted_by: "Maria Garcia",
    starting_time: "2024-12-30T13:00:00Z",
    ending_time: "2024-12-30T18:00:00Z",
    medium: "virtual",
    type: "event",
    about:
      "Intensive mobile app development workshop for intermediate developers.",
    participants: [
      { id: "501", profile: "/images/profiles/user12.webp" },
      { id: "502", profile: "/images/profiles/user13.webp" },
    ],
    address: "Dev Campus, Seattle",
    created_at: "2023-12-05T09:30:00Z",
  },
];
