export const slugifyDefault = {
  lower: true,
  strict: true,
  replacement: "-",
  remove: /[^a-z\d\s]/g,
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
