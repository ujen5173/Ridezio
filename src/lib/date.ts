import { format, formatDistance, isToday, isYesterday } from "date-fns";

export const formatDate = (inputDate: Date) => {
  const now = new Date();

  // If the date is today
  if (isToday(inputDate)) {
    return formatDistance(inputDate, now, { addSuffix: false }) + " ago";
  }

  // If the date is yesterday
  if (isYesterday(inputDate)) {
    return "Yesterday";
  }

  // If the date is within the current year
  if (inputDate.getFullYear() === now.getFullYear()) {
    return format(inputDate, "dd MMM");
  }

  // For dates in different years
  return format(inputDate, "dd MMM yyyy");
};
