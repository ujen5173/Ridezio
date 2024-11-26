import { type ClientUploadedFileData } from "uploadthing/types";
import { type vehicleTypeEnum } from "~/server/db/schema";

export type VehicleUse = "rental" | "sale" | "both";

export type VehicleStatus = "available" | "rented" | "sold" | "maintenance";

export interface Vehicle {
  id: string;
  type: (typeof vehicleTypeEnum.enumValues)[number];
  brand: string;
  model: string;
  year: number;
  use: VehicleUse;
  price_per_hour?: number | null;
  price_per_day?: number | null;
  sale_price?: number | null;
  location: string;
  status: VehicleStatus;
  images: string[];
  features: Record<string, string | boolean>;
  created_at: string;
  updated_at: string;
}

export interface Slide {
  id: string;
  name: string | null;
  rating: number | null;
  images: string[];
  category: string | null;
  location: {
    city?: string | undefined;
    address?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    map?: string | undefined;
  };
  satisfiedCustomers: number | null;
  slug: string | null;
  availableVehicleTypes: (typeof vehicleTypeEnum.enumValues)[number][];
}

export type UploadedFile<T = unknown> = ClientUploadedFileData<T>;
