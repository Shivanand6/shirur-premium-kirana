export const STORE_NAME = "Shirur Kirani Stores";
export const PHONE_RAW = "919611094379";
export const PHONE_DISPLAY = "+91 96110 94379";
export const PHONE_TEL = "tel:+919611094379";
export const WHATSAPP_URL = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(
  "Hello Shirur Kirani Stores, I'd like to place an order. Here is my list:",
)}`;

export const ADDRESS_LINES = [
  "Karnataka Circle, Navanagar",
  "Hubballi, Karnataka",
  "India",
];

export const ADDRESS_ONELINE =
  "Shirur Kirani Stores, Karnataka Circle, Navanagar, Hubballi, Karnataka, India";

export const MAP_EMBED =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(ADDRESS_ONELINE) +
  "&output=embed";

export const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(ADDRESS_ONELINE);

export const NAV_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(ADDRESS_ONELINE);

export const ESTABLISHED_YEAR = 1996;

// Business hours — Monday to Sunday: 7 AM – 2 PM and 5 PM – 10 PM
export const BUSINESS_HOURS = {
  morning: "7:00 AM – 2:00 PM",
  evening: "5:00 PM – 10:00 PM",
  full: "Mon – Sun · 7 AM – 2 PM & 5 PM – 10 PM",
  short: "7 AM – 2 PM · 5 PM – 10 PM",
} as const;

// Admin — only this email may access the admin dashboard.
export const ADMIN_EMAIL = "shivanandshirur99@gmail.com";
