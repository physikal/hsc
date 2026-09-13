/**
 * Published copy & rates from https://horseshoecurveoutdoors.com (2026-09-13).
 * Do not invent prices. Call-only packages stay call-only.
 */

export const siteNav = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/hunts", label: "Packages" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const siteCta = {
  label: "Make a Reservation",
  href: "/book",
} as const;

export const homeCopy = {
  eyebrow: "A Day in the Life…",
  heroHeadline: "Northwest’s Premier Upland Game Bird Hunting Destination!",
  dreamLine:
    "Every hunter dreams of a place where they can escape the hustle and bustle of traffic, work and everyday life.",
  locationLine:
    "Located just outside Pendleton, Oregon, the Umatilla River meanders through our expertly cultivated farmlands. The property offers the perfect mix of planted and wild cover for thrilling upland bird hunts.",
  packagePitch:
    "Reserve an upland package and let us create a memorable experience for your group. Enjoy a round of shooting clays and fully-guided hunts with our expert staff and top-notch dogs. Between hunts, the well-appointed Riverview Lodge provides gourmet meals from our chef and at the end of the day, the cozy saloon or the outdoor fire pit are the perfect backdrops for retelling the day’s adventures.",
  echoPitch:
    "Our Echo Lodge, downriver, is ideal for the more casual guided or non-guided groups. Comfortable and well-stocked, you can custom-tailor your Echo Hunt.",
  cards: [
    {
      title: "Riverview Lodge",
      copy: "Fully guided, all-inclusive packages with sporting clays, chef-inspired meals, beverages & full bar, professional guides & dogs, licensing, and bird cleaning & packaging.",
      href: "/hunts#riverview",
    },
    {
      title: "Echo Lodge",
      copy: "Self-service hunting packages downriver—comfortable lodging with optional guides and dogs. Custom-tailor your Echo Hunt.",
      href: "/hunts#echo",
    },
    {
      title: "Make a Reservation",
      copy: "Browse open hunt slots online, or call (541) 975-4808 to reserve your dates.",
      href: "/book",
    },
  ],
} as const;

export const riverviewIncludes =
  "Sporting clays • Chef-inspired meals • Beverages & full bar • Professional guides & dogs • Licensing • Bird cleaning & packaging";

export const riverviewPackages = [
  {
    id: "rv-1-5",
    name: "1.5 Day Experience | 2 Nights",
    pricePerHunter: 2495,
    priceLabel: "$2,495 / hunter",
    nonHunter: "$300 / non-hunter",
    details: [
      "3pm arrival / 10am departure",
      "50% deposit required*",
      "3% fee for all credit card transactions",
    ],
  },
  {
    id: "rv-2",
    name: "2 Day Experience | 3 Nights",
    pricePerHunter: 3350,
    priceLabel: "$3,350 / hunter",
    nonHunter: "$300 / non-hunter",
    details: [
      "Includes 4 guided hunts",
      "3pm arrival / 10am departure",
      "50% deposit required*",
      "3% fee for all credit card transactions",
    ],
  },
  {
    id: "rv-2-5",
    name: "2.5 Day Experience | 3 Nights",
    pricePerHunter: 3895,
    priceLabel: "$3,895 / hunter",
    nonHunter: "$300 / non-hunter",
    details: [
      "Includes 5 guided hunts",
      "3pm arrival / 2pm departure",
      "50% deposit required*",
      "3% fee for all credit card transactions",
    ],
  },
] as const;

export const riverviewNotes = [
  "*Balance Due 60 Days Prior to stay / 60 day cancellation notice required for a full refund",
  "To have the entire Riverview Lodge exclusively to yourself, a group must be 8 hunters; double-occupancy",
  "We can combine groups of hunters if you do not meet the eight-person minimum for the main lodge.",
  "Please call 541-975-4808 for off-season lodging or long term lodging rates.",
] as const;

export const echoPackages = [
  {
    id: "echo-1",
    name: "1 day + 1 night",
    pricePerHunter: 895,
    priceLabel: "$895 / hunter",
  },
  {
    id: "echo-1-5",
    name: "1.5 days + 2 nights",
    pricePerHunter: 1295,
    priceLabel: "$1,295 / hunter",
  },
  {
    id: "echo-2",
    name: "2 Days + 2 Nights",
    pricePerHunter: 1795,
    priceLabel: "$1,795 / hunter",
  },
] as const;

export const echoAddOns = [
  "$180 / non-hunter / per day",
  "Add Guide + Dogs — $350 / day",
  "Cleaning fee — $100 / group",
  "Bird Cleaning + Packaging — $3 / bird",
  "50% deposit required*",
  "3% fee for all credit card transactions",
] as const;

export const echoNotes = [
  "*Balance Due 60 Days Prior / 60 day cancellation notice required for refund",
  "Suggested gratuity for your guide is 15%",
] as const;

export const dayHunts = {
  intro:
    "We offer full and half-day bird hunts at the ranch. Our hunts are fully-guided with our dogs, and your bird dogs are always welcome.",
  halfDay:
    "For the half-day hunt you have the choice of breakfast or lunch. Half day hunts can be morning or afternoon. Breakfast is at 8 am and the hunt goes until approximately 12:30.",
  fullDay:
    "Full-day hunts include a light grab-and-go breakfast, a break for lunch in the Lodge and an afternoon hunt. After either hunt, relax in our saloon with a beer while your guides clean and process your birds.",
  pricing:
    "Day hunts and half day hunt packages can be customized based on your group size. Full day hunts are $995 per person and half day hunts $695. Call us to inquire about available dates.",
  fullDayPrice: 995,
  halfDayPrice: 695,
} as const;

export const bigGameHunts = {
  headline: "We are excited to offer deer and cow elk hunts",
  intro:
    "We have access to over 15K private acres of varied terrain for excellent spot & stalk opportunities.",
  note: "Our hunts are two hunters per guide.",
  contact:
    "For more information call Delwyn at 541.571.3404 or email us at info@horseshoecurveoutdoors.com",
  packages: [
    {
      name: "Deer Hunt #1 — Archery · 4 Hunting Days + 5 Nights",
      priceLabel: "$4,500 / hunter",
      pricePerHunter: 4500,
    },
    {
      name: "Deer Hunt #2 — Rifle · 4 Hunting Days + 5 Nights",
      priceLabel: "$5,995 / hunter",
      pricePerHunter: 5995,
    },
    {
      name: "Rifle Cow Hunt · 2 Hunting Days + 3 Nights",
      priceLabel: "$3,495 / hunter",
      pricePerHunter: 3495,
    },
  ],
} as const;

export const turkeyHunts = {
  headline: "Turkey Hunts — full service accommodations with lodging",
  priceLabel: "$1000 PER DAY",
  pricePerDay: 1000,
  contact:
    "For more information please contact Delwyn Hendrickson at 541.571.3404 or email at delwyn@hscoutdoors.onmicrosoft.com",
} as const;

export const galleryFilters = [
  { id: "all", label: "All" },
  { id: "hunts", label: "The Hunts" },
  { id: "land", label: "The Land" },
  { id: "lodging", label: "The Lodging" },
] as const;

export const contactCopy = {
  heading: "Contact Us",
  clubLine: "Horseshoe Curve Hunt Club",
} as const;

export const realSiteOnlyNav = [
  "Accommodations → Food + Drink",
  "Accommodations → Riverview Lodge (detail page)",
  "Accommodations → Echo Lodge (detail page)",
  "Retreats",
  "Partnerships",
  "Map + Directions",
] as const;
