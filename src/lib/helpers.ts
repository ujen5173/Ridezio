export const slugifyDefault = {
  lower: true,
  strict: true,
  replacement: "-",
  locale: "en",
  trim: true,
} as {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
};

export function extractDirectionsFromIframe(iframeSrc: string): string {
  // Check if the source is a valid Google Maps URL
  if (!iframeSrc?.includes("google.com/maps")) {
    return "# ";
  }

  // Extract place name from the URL
  const placeNameMatch = /!2s(.+?)!/.exec(iframeSrc);
  const placeName = placeNameMatch
    ? decodeURIComponent(placeNameMatch[1]!).replace(/\+/g, " ")
    : null;

  // Throw an error if no place name is found
  if (!placeName) {
    return "# ";
  }

  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;

  return googleMapsLink;
}
