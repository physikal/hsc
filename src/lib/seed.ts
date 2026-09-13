import type { StoreData } from "./types";

function daysFromNow(days: number, hour = 8): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

function endOf(startIso: string, hours: number): string {
  const d = new Date(startIso);
  d.setUTCHours(d.getUTCHours() + hours);
  return d.toISOString();
}

const now = new Date().toISOString();

/**
 * Bookable seed hunts — titles and pricePerGuest match published rates on
 * horseshoecurveoutdoors.com (Full Service Riverview, Self Service Echo, Day Hunts).
 * Big game / turkey are listed on the marketing hunts page but are call-to-book only.
 */
export const seedStore: StoreData = {
  hunts: [
    {
      id: "hunt_rv_15",
      title: "Full Service Riverview Lodge — 1.5 Day | 2 Nights",
      description:
        "All packages include: Sporting clays • Chef-inspired meals • Beverages & full bar • Professional guides & dogs • Licensing • Bird cleaning & packaging. 3pm arrival / 10am departure. $300 / non-hunter. 50% deposit required.",
      packageType: "upland",
      durationHours: 36,
      maxGuests: 8,
      pricePerGuest: 2495,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_rv_2",
      title: "Full Service Riverview Lodge — 2 Day | 3 Nights",
      description:
        "Includes 4 guided hunts. All packages include sporting clays, chef-inspired meals, beverages & full bar, professional guides & dogs, licensing, and bird cleaning & packaging. 3pm arrival / 10am departure. $300 / non-hunter.",
      packageType: "upland",
      durationHours: 48,
      maxGuests: 8,
      pricePerGuest: 3350,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_rv_25",
      title: "Full Service Riverview Lodge — 2.5 Day | 3 Nights",
      description:
        "Includes 5 guided hunts. All packages include sporting clays, chef-inspired meals, beverages & full bar, professional guides & dogs, licensing, and bird cleaning & packaging. 3pm arrival / 2pm departure. $300 / non-hunter.",
      packageType: "upland",
      durationHours: 60,
      maxGuests: 8,
      pricePerGuest: 3895,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_echo_1",
      title: "Self Service Hunts — 1 day + 1 night",
      description:
        "Echo Lodge self-service package. Non-hunter $180 / day. Add Guide + Dogs $350 / day. Cleaning fee $100 / group. Bird cleaning + packaging $3 / bird. 50% deposit required.",
      packageType: "echo",
      durationHours: 24,
      maxGuests: 8,
      pricePerGuest: 895,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_echo_15",
      title: "Self Service Hunts — 1.5 days + 2 nights",
      description:
        "Echo Lodge self-service package. Non-hunter $180 / day. Add Guide + Dogs $350 / day. Cleaning fee $100 / group. Bird cleaning + packaging $3 / bird.",
      packageType: "echo",
      durationHours: 36,
      maxGuests: 8,
      pricePerGuest: 1295,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_echo_2",
      title: "Self Service Hunts — 2 Days + 2 Nights",
      description:
        "Echo Lodge self-service package. Non-hunter $180 / day. Add Guide + Dogs $350 / day. Cleaning fee $100 / group. Bird cleaning + packaging $3 / bird.",
      packageType: "echo",
      durationHours: 48,
      maxGuests: 8,
      pricePerGuest: 1795,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_day_full",
      title: "Day Hunts — Full Day",
      description:
        "Fully-guided day hunt with our dogs; your bird dogs are always welcome. Includes a light grab-and-go breakfast, lunch break in the Lodge, and an afternoon hunt. After the hunt, relax in our saloon while guides clean and process your birds.",
      packageType: "clays",
      durationHours: 8,
      maxGuests: 10,
      pricePerGuest: 995,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_day_half",
      title: "Day Hunts — Half Day",
      description:
        "Fully-guided half-day hunt with our dogs. Choice of breakfast or lunch; morning or afternoon. Breakfast at 8 am, hunt until approximately 12:30.",
      packageType: "clays",
      durationHours: 4,
      maxGuests: 10,
      pricePerGuest: 695,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ],
  slots: [
    {
      id: "slot_1",
      huntId: "hunt_rv_15",
      startAt: daysFromNow(14, 15),
      endAt: endOf(daysFromNow(14, 15), 43),
      capacity: 8,
      bookedCount: 2,
      status: "open",
      notes: "Riverview Lodge — 1.5 Day | 2 Nights",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_2",
      huntId: "hunt_rv_2",
      startAt: daysFromNow(28, 15),
      endAt: endOf(daysFromNow(28, 15), 67),
      capacity: 8,
      bookedCount: 0,
      status: "open",
      notes: "Riverview Lodge — 2 Day | 3 Nights",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_3",
      huntId: "hunt_echo_1",
      startAt: daysFromNow(10, 14),
      endAt: endOf(daysFromNow(10, 14), 24),
      capacity: 8,
      bookedCount: 1,
      status: "open",
      notes: "Echo Lodge self-service",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_4",
      huntId: "hunt_echo_15",
      startAt: daysFromNow(21, 14),
      endAt: endOf(daysFromNow(21, 14), 44),
      capacity: 8,
      bookedCount: 0,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_5",
      huntId: "hunt_day_full",
      startAt: daysFromNow(5, 8),
      endAt: endOf(daysFromNow(5, 8), 8),
      capacity: 6,
      bookedCount: 1,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_6",
      huntId: "hunt_day_half",
      startAt: daysFromNow(6, 8),
      endAt: endOf(daysFromNow(6, 8), 4),
      capacity: 6,
      bookedCount: 0,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_7",
      huntId: "hunt_day_full",
      startAt: daysFromNow(12, 8),
      endAt: endOf(daysFromNow(12, 8), 8),
      capacity: 6,
      bookedCount: 0,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_8",
      huntId: "hunt_rv_25",
      startAt: daysFromNow(35, 15),
      endAt: endOf(daysFromNow(35, 15), 71),
      capacity: 8,
      bookedCount: 0,
      status: "open",
      notes: "Riverview Lodge — 2.5 Day | 3 Nights",
      createdAt: now,
      updatedAt: now,
    },
  ],
  bookings: [
    {
      id: "book_demo",
      slotId: "slot_1",
      huntId: "hunt_rv_15",
      guestName: "Jordan Hale",
      guestEmail: "jordan.hale@example.com",
      guestPhone: "(541) 555-0142",
      partySize: 2,
      notes: "Demo booking",
      status: "confirmed",
      confirmationCode: "HCO-DEMO01",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "book_demo2",
      slotId: "slot_5",
      huntId: "hunt_day_full",
      guestName: "Sam Rivera",
      guestEmail: "sam.rivera@example.com",
      guestPhone: "(541) 555-0198",
      partySize: 1,
      status: "confirmed",
      confirmationCode: "HCO-DEMO02",
      createdAt: now,
      updatedAt: now,
    },
  ],
};
