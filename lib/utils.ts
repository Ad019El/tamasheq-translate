import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertArabicToLatin = (text: String) => {
  const patterns = [
    /ا/g,
    /أ/g,
    /آ/g,
    /إ/g,
    /ب/g,
    /ت/g,
    /ث/g,
    /ج/g,
    /ح/g,
    /خ/g,
    /د/g,
    /ذ/g,
    /ر/g,
    /ز/g,
    /س/g,
    /ش/g,
    /ص/g,
    /ض/g,
    /ط/g,
    /ظ/g,
    /ع/g,
    /غ/g,
    /ف/g,
    /ق/g,
    /ك/g,
    /ل/g,
    /م/g,
    /ن/g,
    /ه/g,
    /و/g,
    /ي/g,
    /ى/g,
    /ئ/g,
    /ء/g,
    /ؤ/g,
    /لا/g,
    /ة/g,
    /ڤ/g,
  ];
  const replacements = [
    "a",
    "a",
    "a",
    "e",
    "b",
    "t",
    "th",
    "j",
    "h",
    "kh",
    "d",
    "dh",
    "r",
    "z",
    "s",
    "sh",
    "s",
    "d",
    "t",
    "z",
    "'e",
    "gh",
    "f",
    "q",
    "k",
    "l",
    "m",
    "n",
    "h",
    "w",
    "y",
    "a",
    "'e",
    "'",
    "'e",
    "la",
    "h",
    "g",
  ];

  for (const pattern of patterns) {
    text = text.replace(pattern, replacements[patterns.indexOf(pattern)]);
  }

  return text;
};
