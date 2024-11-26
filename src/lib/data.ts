import { type vehicleTypeEnum } from "~/server/db/schema";
import { type Slide } from "~/types";
import { type ShopData } from "~/types/bookings";

export const searchedData = [
  {
    id: "1",
    name: "Mountain Biker's Haven",
    slug: "mountain-bikers-haven",
    rating: 4.8,
    location: {
      city: "123 Trail Way, Adventure City, AC 12345",
    },
    satisfiedCustomers: 120,
    availableVehiclesTypes: ["bicycle", "bike"],
    images: [
      "/images/shops/img1.jpg",
      "/images/shops/img2.jpg",
      "/images/shops/img4.jpg",
    ],
    lonlat: [34.0522, -118.2437],
  },
  {
    id: "2",
    name: "Urban Cycling Co.",
    slug: "urban-cycling-co",
    rating: 4.5,
    location: {
      city: "456 City Lane, Metropolis, MP 67890",
    },
    satisfiedCustomers: 95,
    availableVehiclesTypes: ["bicycle", "e-bicycle"],
    images: [
      "/images/shops/img3.jpg",
      "/images/shops/img-1.jpg",
      "/images/shops/img-3.jpg",
    ],
    lonlat: [40.7128, -74.006],
  },
  {
    id: "3",
    name: "Eco-Friendly Rentals",
    slug: "eco-friendly-rentals",
    rating: 4.7,
    location: {
      city: "789 Green St, Eco City, EC 54321",
    },
    satisfiedCustomers: 150,
    availableVehiclesTypes: ["bicycle", "e-bicycle"],
    images: [
      "/images/shops/img-2.jpg",
      "/images/shops/img1.jpg",
      "/images/shops/img-4.jpg",
    ],
    lonlat: [37.7749, -122.4194],
  },
  {
    id: "4",
    name: "Beachside Bikes",
    slug: "beachside-bikes",
    rating: 4.6,
    location: {
      city: "101 Ocean Blvd, Seaside Town, ST 98765",
    },
    satisfiedCustomers: 80,
    availableVehiclesTypes: ["bicycle", "bike"],
    images: [
      "/images/shops/img4.jpg",
      "/images/shops/img3.jpg",
      "/images/shops/img2.jpg",
    ],
    lonlat: [36.7783, -119.4179],
  },
  {
    id: "5",
    name: "Cycle Explorers",
    slug: "cycle-explorers",
    rating: 4.9,
    location: {
      city: "202 Adventure Rd, Explore City, EC 12345",
    },
    satisfiedCustomers: 200,
    availableVehiclesTypes: ["bicycle", "e-bicycle"],
    images: [
      "/images/shops/img-1.jpg",
      "/images/shops/img-3.jpg",
      "/images/shops/img-2.jpg",
    ],
    lonlat: [34.0522, -118.2437],
  },
  {
    id: "6",
    name: "City Cycle Rentals",
    slug: "city-cycle-rentals",
    rating: 4.4,
    location: {
      city: "303 Urban Ave, Downtown City, DC 87654",
    },
    satisfiedCustomers: 110,
    availableVehiclesTypes: ["bicycle", "e-bicycle", "scooter"],
    images: [
      "/images/shops/img4.jpg",
      "/images/shops/img-4.jpg",
      "/images/shops/img2.jpg",
    ],
    lonlat: [51.5074, -0.1278],
  },
  {
    id: "7",
    name: "Adventure Bike Rentals",
    slug: "adventure-bike-rentals",
    rating: 4.8,
    location: {
      city: "404 Mountain Rd, Boulder Town, BT 34567",
    },
    satisfiedCustomers: 140,
    availableVehiclesTypes: ["bicycle", "e-bicycle", "bike"],
    images: [
      "/images/shops/img1.jpg",
      "/images/shops/img-1.jpg",
      "/images/shops/img-2.jpg",
    ],
    lonlat: [39.7392, -104.9903],
  },
  {
    id: "8",
    name: "Pedal Power",
    slug: "pedal-power",
    rating: 4.9,
    location: {
      city: "505 Pedal St, Cyclersville, CY 65432",
    },
    satisfiedCustomers: 175,
    availableVehiclesTypes: ["bicycle", "e-bicycle", "bike"],
    images: [
      "/images/shops/img-3.jpg",
      "/images/shops/img4.jpg",
      "/images/shops/img3.jpg",
    ],
    lonlat: [48.8566, 2.3522],
  },
  {
    id: "9",
    name: "Eco Pedals",
    slug: "eco-pedals",
    rating: 4.7,
    location: {
      city: "606 Eco Dr, Green City, GC 43210",
    },
    satisfiedCustomers: 165,
    availableVehiclesTypes: ["bicycle", "e-bicycle"],
    images: [
      "/images/shops/img2.jpg",
      "/images/shops/img-4.jpg",
      "/images/shops/img1.jpg",
    ],
    lonlat: [52.52, 13.405],
  },
  {
    id: "10",
    name: "BikeTime Rentals",
    slug: "biketime-rentals",
    rating: 4.6,
    location: {
      city: "707 Speed Ave, Fast City, FC 76543",
    },
    satisfiedCustomers: 130,
    availableVehiclesTypes: ["bicycle", "e-bicycle", "scooter"],
    images: [
      "/images/shops/img-2.jpg",
      "/images/shops/img-3.jpg",
      "/images/shops/img1.jpg",
    ],
    lonlat: [55.7558, 37.6173],
  },
  {
    id: "11",
    name: "Tour de Cycle",
    slug: "tour-de-cycle",
    rating: 4.5,
    location: {
      city: "808 Cycle Way, Ride City, RC 87654",
    },
    satisfiedCustomers: 115,
    availableVehiclesTypes: ["bicycle", "e-bicycle", "scooter"],
    images: [
      "/images/shops/img3.jpg",
      "/images/shops/img1.jpg",
      "/images/shops/img4.jpg",
    ],
    lonlat: [41.9028, 12.4964],
  },
  {
    id: "12",
    name: "Urban Wheelers",
    slug: "urban-wheelers",
    rating: 4.7,
    location: {
      city: "909 Downtown Blvd, Big City, BC 76543",
    },
    satisfiedCustomers: 190,
    availableVehiclesTypes: ["bicycle", "e-bicycle", "scooter", "e-car"],
    images: [
      "/images/shops/img-4.jpg",
      "/images/shops/img2.jpg",
      "/images/shops/img-2.jpg",
    ],
    lonlat: [35.6895, 139.6917],
  },
] as {
  id: string;
  name: string;
  slug: string;
  rating: number;
  location: {
    city?: string;
  };
  satisfiedCustomers: number;
  availableVehiclesTypes: (typeof vehicleTypeEnum.enumValues)[number][];
  images: string[];
  lonlat: number[];
}[];

export const slides = [
  {
    id: "basi-rental-service",
    name: "Basi Rental Service",
    slug: "basi-rental-service",
    rating: 4.5,
    location: {
      city: "Kathmandu, Nepal",
    },
    availableVehicleTypes: ["bicycle", "bike"],
    satisfiedCustomers: 200,
    category: "bicycle",
    images: [
      "/images/shops/img1.jpg",
      "/images/shops/img3.jpg",
      "/images/shops/img2.jpg",
      "/images/shops/img4.jpg",
    ],
  },
  {
    id: "epic-mountian-bike",
    name: "Epic Mountain Bike",
    slug: "epic-mountian-bike",
    rating: 4.8,
    location: {
      city: "New Road, Kathmandu",
    },
    satisfiedCustomers: 350,
    category: "bicycle",
    availableVehicleTypes: ["bike", "scooter"],
    images: [
      "/images/shops/img2.jpg",
      "/images/shops/img1.jpg",
      "/images/shops/img4.jpg",
      "/images/shops/img3.jpg",
    ],
  },
  {
    id: "saddle-bike-store",
    name: "Saddle Bike Store",
    slug: "saddle-bike-store",
    rating: 4.3,
    location: {
      city: "Near Labim Mall, Lalitpur",
    },
    availableVehicleTypes: ["bike", "e-bicycle", "e-car"],
    satisfiedCustomers: 180,
    category: "bicycle",
    address: "Bhaktapur, Nepal",
    images: ["/images/shops/img1.jpg", "/images/shops/img3.jpg"],
  },
  {
    id: "himalayan-single-track",
    name: "Himalayan Single Track",
    slug: "himalayan-single-track",
    rating: 4.7,
    location: {
      city: "Jhamshikel, Kathmandu",
    },
    satisfiedCustomers: 400,
    category: "bicycle",
    address: "Kathmandu, Nepal",
    images: ["/images/shops/img4.jpg"],
    availableVehicleTypes: ["scooter", "bicycle"],
  },
  {
    id: "bb-cycle-center",
    name: "B.B Cycle Center",
    slug: "bb-cycle-center",
    rating: 4.5,
    availableVehicleTypes: ["car", "bike"],
    satisfiedCustomers: 200,
    category: "bicycle",
    location: {
      city: "Balkumari, Lalitpur",
    },
    images: [
      "/images/shops/img1.jpg",
      "/images/shops/img3.jpg",
      "/images/shops/img2.jpg",
      "/images/shops/img4.jpg",
    ],
  },
] as Slide[];

export const vendorDetail = {
  id: "af90f38d-2e8a-4fc8-b0ff-cec585cedbb0",
  ownerId: "1",
  name: "Epic Mountain Bike Nepal",
  location: [
    {
      address: "Jhamsikhel Rd",
      city: "Kathmandu",
      state: "Bagmati",
      zip: "44600",
    },
    {
      address: "Gwarko, Lalitpur",
      city: "Kathmandu",
      state: "Bagmati",
      zip: "44600",
    },
  ],
  socials: {
    facebook: "https://www.facebook.com/epicmountainbike",
    instagram: "https://www.instagram.com/epicmountainbike",
    twitter: "https://www.twitter.com/epicmountainbike",
    website: "https://www.epicmountainbike.com",
  },
  phoneNumbers: ["9812345678", "9812345679"],
  businessHours: {
    monday: {
      open: "9:00",
      close: "17:00",
    },
    tuesday: {
      open: "9:00",
      close: "17:00",
    },
    wednesday: {
      open: "9:00",
      close: "17:00",
    },
    thursday: {
      open: "9:00",
      close: "17:00",
    },
    friday: {
      open: "9:00",
      close: "17:00",
    },
    saturday: {
      open: "9:00",
      close: "17:00",
    },
    sunday: {
      open: "9:00",
      close: "17:00",
    },
  },
  rating: 4.5,
  ratingCount: 67,
  bannerImage: "/images/background-pattern.jpg",
  logoImage: "/images/vendor/logo.jpg",
  shopImages: [
    "/images/shops/img-1.jpg",
    "/images/shops/img-2.jpg",
    "/images/shops/img-3.jpg",
    "/images/shops/img-4.jpg",
    "/images/shops/img-2.jpg",
  ],
  longRidesAvailable: true,
  faqs: [
    {
      question: "What documents do I need to rent a bike?",
      answer: "You just need a valid ID and a contact number to rent a bike.",
    },
    {
      question: "Is the bike insured during the rental period?",
      answer:
        "Yes, all our bikes come with basic insurance during the rental period.",
    },
    {
      question: "What happens if I return the bike late?",
      answer:
        "If the bike is returned late, an extra rental fee may apply based on how long the delay is.",
    },
    {
      question: "Are accessories included with the bike rental?",
      answer:
        "Yes, we provide basic accessories like helmets and locks for free with your bike rental.",
    },
    {
      question: "Can I customize or modify the bike?",
      answer:
        "No, we don't allow any modifications or changes to the bike during the rental period.",
    },
    {
      question: "What should I do if the bike gets damaged?",
      answer:
        "If the bike is damaged, please contact us immediately. You may be responsible for repair costs depending on the damage.",
    },
  ],
};

export const vendorVehicles = [
  {
    id: "1f45a2d1-4c9b-4e8b-a348-9e15d3b2c1a2",
    type: "bike",
    brand: "Trek",
    category: "Sports Bike",
    model: "Yamaha YZF-R15",
    year: 2023,
    use: "rental",
    price_per_hour: 5.0,
    price_per_day: 25.0,
    sale_price: null,
    location: "Kathmandu, Nepal",
    status: "available",
    images: [
      "/images/vendor/vehicles/img1.jpg",
      "/images/vendor/vehicles/img2.jpg",
    ],
    features: {
      Gears: "22-speed",
      "Frame material": "Carbon",
      "Brake Type": "Disc",
    },
    created_at: "2024-10-01T10:15:00Z",
    updated_at: "2024-10-01T10:15:00Z",
  },
  {
    id: "e3a8f5d9-4bce-44e9-82ba-7cbce71e6f4b",
    type: "car",
    brand: "Yamaha",
    category: "Mountain bike",
    model: "MT-15",
    year: 2022,
    use: "rental",
    price_per_hour: 10.0,
    price_per_day: 50.0,
    sale_price: null,
    location: "Pokhara, Nepal",
    status: "rented",
    images: [
      "/images/vendor/vehicles/img1.jpg",
      "/images/vendor/vehicles/img1.jpg",
    ],
    features: {
      engine_capacity: "155cc",
      fuel_type: "Petrol",
      mileage: "45 kmpl",
    },
    created_at: "2024-09-20T11:00:00Z",
    updated_at: "2024-09-25T12:30:00Z",
  },
  {
    id: "d9fa3f2a-123f-4569-bd1b-5d7c7e4d8a3b",
    type: "scooter",
    brand: "Honda",
    category: "Mountain bike",
    model: "Activa 6G",
    year: 2021,
    use: "rental",
    price_per_hour: 8.0,
    price_per_day: 40.0,
    sale_price: null,
    location: "Bhaktapur, Nepal",
    status: "available",
    images: ["/images/vendor/vehicles/img2.jpg"],
    features: {
      engine_capacity: "109cc",
      fuel_type: "Petrol",
      mileage: "55 kmpl",
    },
    created_at: "2024-08-15T09:45:00Z",
    updated_at: "2024-08-15T09:45:00Z",
  },
  {
    id: "3b54de4f-6d28-432f-973a-8c5f23b9a7f9",
    type: "car",
    brand: "Hyundai",
    category: "Mountain bike",
    model: "Creta",
    year: 2023,
    use: "rental",
    price_per_hour: 20.0,
    price_per_day: 120.0,
    sale_price: null,
    location: "Lalitpur, Nepal",
    status: "available",
    images: [
      "/images/vendor/vehicles/img3.jpg",
      "/images/vendor/vehicles/img3.jpg",
    ],
    features: {
      fuel_type: "Diesel",
      transmission: "Automatic",
      seating_capacity: "5",
    },
    created_at: "2024-09-05T14:20:00Z",
    updated_at: "2024-09-05T14:20:00Z",
  },
  {
    id: "4c16d2a1-beb7-4c5b-922d-6a84c543abc8",
    type: "e-bike",
    brand: "Lectric",
    category: "Mountain bike",
    model: "XP 3.0",
    year: 2023,
    use: "rental",
    price_per_hour: 7.0,
    price_per_day: 35.0,
    sale_price: null,
    location: "Lumbini, Nepal",
    status: "available",
    images: ["/images/vendor/vehicles/img4.jpg"],
    features: {
      battery_range: "45 miles",
      motor_power: "500W",
      foldable: true,
    },
    created_at: "2024-10-01T10:00:00Z",
    updated_at: "2024-10-01T10:00:00Z",
  },
  {
    id: "5a24b13e-948f-4d4c-a681-ea4e86569d8c",
    type: "bike",
    brand: "Giant",
    category: "Mountain bike",
    model: "Escape 3",
    year: 2022,
    use: "sale",
    price_per_hour: null,
    price_per_day: null,
    sale_price: 450.0,
    location: "Chitwan, Nepal",
    status: "available",
    images: ["/images/vendor/vehicles/img5.jpg"],
    features: {
      gears: "21-speed",
      frame_material: "Aluminum",
      brake_type: "V-brake",
    },
    created_at: "2024-09-15T08:30:00Z",
    updated_at: "2024-09-15T08:30:00Z",
  },
  {
    id: "6b75f1e2-9b1d-42b3-876b-4b84a9d8b9e7",
    type: "car",
    brand: "Toyota",
    category: "Mountain bike",
    model: "Corolla Altis",
    year: 2021,
    use: "both",
    price_per_hour: 15.0,
    price_per_day: 90.0,
    sale_price: 20000.0,
    location: "Butwal, Nepal",
    status: "available",
    images: ["/images/vendor/vehicles/img6.jpg"],
    features: {
      fuel_type: "Petrol",
      transmission: "Manual",
      seating_capacity: "5",
    },
    created_at: "2024-09-30T12:00:00Z",
    updated_at: "2024-09-30T12:00:00Z",
  },
  {
    id: "7e13b7c1-9b8d-4f7f-85b7-1cda0a948f7e",
    type: "scooter",
    brand: "Vespa",
    category: "Mountain bike",
    model: "GTS 300",
    year: 2022,
    use: "rental",
    price_per_hour: 12.0,
    price_per_day: 60.0,
    sale_price: null,
    location: "Kathmandu, Nepal",
    status: "available",
    images: [
      "/images/vendor/vehicles/img7.jpg",
      "/images/vendor/vehicles/img7.jpg",
    ],
    features: {
      engine_capacity: "300cc",
      fuel_type: "Petrol",
      mileage: "31 kmpl",
    },
    created_at: "2024-10-15T13:30:00Z",
    updated_at: "2024-10-15T13:30:00Z",
  },
  {
    id: "8b32f7c2-4c3f-4976-b5c6-124deea9a7f3",
    type: "bike",
    brand: "Royal Enfield",
    category: "Mountain bike",
    model: "Classic 350",
    year: 2021,
    use: "rental",
    price_per_hour: 15.0,
    price_per_day: 70.0,
    sale_price: null,
    location: "Pokhara, Nepal",
    status: "available",
    images: [
      "/images/vendor/vehicles/img10.jpg",
      "/images/vendor/vehicles/img10.jpg",
    ],
    features: {
      engine_capacity: "350cc",
      fuel_type: "Petrol",
      mileage: "40 kmpl",
    },
    created_at: "2024-09-10T10:45:00Z",
    updated_at: "2024-09-10T10:45:00Z",
  },
  {
    id: "9c43e9c3-543b-4d4c-99b1-2d89d8f8c7a5",
    type: "car",
    brand: "Ford",
    category: "Mountain bike",
    model: "Mustang GT",
    year: 2023,
    use: "both",
    price_per_hour: 40.0,
    price_per_day: 250.0,
    sale_price: 55000.0,
    location: "Lalitpur, Nepal",
    status: "available",
    images: [
      "/images/vendor/vehicles/img9.jpg",
      "/images/vendor/vehicles/img9.jpg",
    ],
    features: {
      engine_capacity: "5.0L V8",
      fuel_type: "Petrol",
      transmission: "Automatic",
      seating_capacity: "4",
    },
    created_at: "2024-10-05T11:30:00Z",
    updated_at: "2024-10-05T11:30:00Z",
  },
];

export const eventDetail = {
  id: 1,
  title: "Cycling ride to Shipvapuri",
  hostedBy: {
    logo: "/images/shops/img1.jpg",
    name: "Epic Mountain Bike Nepal",
  },
  details: {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Welcome to Tiptap",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Hey adventure seekers! Get ready for an epic cycling hike brought to you by Epic Mountain Bike Nepal! 🚴🏞️ If you love the mountains and have a thing for wheels, this ride is all about exploring, tackling trails, and having a blast with fellow bikers.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "We’re kicking things off early at 7:00 am (gotta beat that morning sun!), where we'll meet at the Epic Mountain Bike Nepal base, load up our gear, and get a quick rundown of the day's plan. By 7:30 am, we’ll hit the road in our vehicle convoy, heading up to the trail starting point. You’ll have a quick coffee to wake you up before we start pedaling.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 4 },
        content: [
          {
            type: "text",
            text: "Timeline for the day:",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: `7:00 am - Meet Up: Gather at Epic Mountain Bike Nepal. Time to gear up, grab a cup of coffee, and meet the crew.7:30 am - Drive Out: Load up and head to the trailhead together – the ride up will get you pumped up!8:30 am - Start of the Cycling Hike: Helmets on, pedals ready, and we’re off! The first leg is an easy ride to warm up, get used to the trail, and take in the insane views.10:00 am - Midway Break: We’ll take a quick rest, stretch, and have a snack – trust us, you’ll need it for the climbs ahead!10:30 am - The Ascent: Here’s where the challenge begins! We’ll take on a few climbs, but no worries, the views at the top are so worth it.12:00 pm - Lunch Stop: Picnic-style lunch with views that make you never want to leave. Recharge, laugh, and snap some pics!1:00 pm - Downhill Thrills: Time for the downhill adventure! This stretch is all about speed, skill, and pure fun as we head back.3:00 pm - Wrap-Up: Back to base, where we’ll chill out, share stories from the trail, and take a final group pic to remember the day.`,
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "No experience needed, just a love for the outdoors and some energy for the ride. Bring your bike, gear, and your best vibes, and get ready for a day packed with thrills, laughs, and mountain magic!",
          },
        ],
      },
    ],
  },
  date: "2024-10-26T12:34:56.789Z",
  starting: {
    place: "The British College, Kathmandu",
    city: "Thapathali Road, Kathmandu",
    geo: {
      lat: 27.6937,
      lng: 85.3206,
    },
  },
  destination: {
    place: "The British College, Kathmandu",
    city: "Thapathali Road, Kathmandu",
    geo: {
      lat: 27.6937,
      lng: 85.3206,
    },
  },
};

// Mock API Data with bookings
export const shopData: ShopData = {
  vehicleTypes: {
    bicycle: {
      label: "Cycle",
      startingPrice: 500,
      types: [
        {
          name: "Mountain Bike",
          vehicles: [
            {
              id: "781c0a6d-32b0-4404-95a4-1b3ce15e1838",
              name: "Trek Marlin 7",
              inventory: 3,
              basePrice: 800,
            },
            {
              id: "d2a7925c-3c76-4eb7-924d-0efc33126e4d",
              name: "Specialized Rockhopper",
              inventory: 2,
              basePrice: 700,
            },
          ],
        },
        {
          name: "Road Bike",
          vehicles: [
            {
              id: "f3b8e8c0-1234-4567-89ab-cdef01234567",
              name: "Giant Contend 1",
              inventory: 4,
              basePrice: 600,
            },
            {
              id: "a1b2c3d4-5678-90ef-ghij-klmnop123456",
              name: "Trek Domane SL 6",
              inventory: 1,
              basePrice: 900,
            },
          ],
        },
      ],
    },
    motorcycle: {
      label: "Motorcycle",
      startingPrice: 1500,
      types: [
        {
          name: "Sport",
          vehicles: [
            {
              id: "b2c3d4e5-6789-0123-4567-89abcdef0123",
              name: "Kawasaki Ninja",
              inventory: 2,
              basePrice: 2000,
            },
            {
              id: "c3d4e5f6-7890-1234-5678-90abcdef1234",
              name: "Honda CBR",
              inventory: 3,
              basePrice: 1800,
            },
          ],
        },
        {
          name: "Cruiser",
          vehicles: [
            {
              id: "d4e5f6g7-8901-2345-6789-0abcdef12345",
              name: "Harley Davidson Iron 883",
              inventory: 1,
              basePrice: 2500,
            },
            {
              id: "e5f6g7h8-9012-3456-7890-1abcdef23456",
              name: "Royal Enfield Classic",
              inventory: 4,
              basePrice: 1600,
            },
          ],
        },
      ],
    },
  },
  bookings: [
    {
      vehicleId: "781c0a6d-32b0-4404-95a4-1b3ce15e1838",
      startDate: "2024-10-28",
      endDate: "2024-10-29",
      quantity: 3,
    },
    {
      vehicleId: "781c0a6d-32b0-4404-95a4-1b3ce15e1838",
      startDate: "2024-11-03",
      endDate: "2024-11-05",
      quantity: 3,
    },
    {
      vehicleId: "781c0a6d-32b0-4404-95a4-1b3ce15e1838",
      startDate: "2024-11-15",
      endDate: "2024-11-20",
      quantity: 3,
    },
    {
      vehicleId: "781c0a6d-32b0-4404-95a4-1b3ce15e1838",
      startDate: "2024-10-28",
      endDate: "2024-10-29",
      quantity: 3,
    },
    {
      vehicleId: "d2a7925c-3c76-4eb7-924d-0efc33126e4d",
      startDate: "2024-10-30",
      endDate: "2024-10-31",
      quantity: 1,
    },
  ],
};
