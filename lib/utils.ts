import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in TND
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
  }).format(price);
}

// Format Tunisian phone number
export function formatTunisianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("216")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("0")) {
    return `+216${cleaned.slice(1)}`;
  }
  return `+216${cleaned}`;
}

// Validate Tunisian phone number
export function isValidTunisianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Tunisian numbers are 8 digits long and start with 2, 4, 5, 7 or 9
  // If including country code, they are 11 digits long and start with 216 followed by 2, 4, 5, 7 or 9
  const isEightDigit = cleaned.length === 8 && /^[24579]/.test(cleaned);
  const isElevenDigit = cleaned.length === 11 && /^216[24579]/.test(cleaned);
  
  return isEightDigit || isElevenDigit;
}

// Tunisian governorates
export const TUNISIAN_GOVERNORATES = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Kef",
  "Mahdia",
  "Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

// Calculate shipping cost by governorate
export function calculateShippingCost(governorate: string): number {
  const capital = ["Tunis", "Ariana", "Ben Arous", "Manouba"];
  const coastal = ["Sfax", "Sousse", "Monastir", "Nabeul", "Bizerte"];
  
  if (capital.includes(governorate)) {
    return 5; // 5 TND
  }
  if (coastal.includes(governorate)) {
    return 8; // 8 TND
  }
  return 12; // 12 TND for other governorates
}
