import {
  Armchair,
  Bath,
  BatteryCharging,
  BrickWall,
  Building2,
  Car,
  CarFront,
  CookingPot,
  Cctv,
  DoorOpen,
  Droplets,
  Dumbbell,
  Fence,
  Gauge,
  Grid2X2,
  House,
  HousePlus,
  Layers,
  Shield,
  ShieldCheck,
  Shirt,
  Sofa,
  Thermometer,
  Toilet,
  Trees,
  Utensils,
  UsersRound,
  WashingMachine,
  Waves,
  Wifi,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type FacilityCategory = "Most popular" | "Property & building" | "Convenience & utilities" | "More features";

type FacilityDefinition = {
  id: string;
  label: string;
  category: FacilityCategory;
  icon: LucideIcon;
  legacyLabels?: string[];
};

export const facilityCatalogue = [
  { id: "wifi", label: "Free WiFi", category: "Most popular", icon: Wifi, legacyLabels: ["Wi-Fi", "Internet"] },
  { id: "parking", label: "Free parking", category: "Most popular", icon: CarFront, legacyLabels: ["Parking"] },
  { id: "pool", label: "Swimming pool", category: "Most popular", icon: Waves, legacyLabels: ["Pool"] },
  { id: "gym", label: "Fitness centre", category: "Most popular", icon: Dumbbell, legacyLabels: ["Gym"] },
  { id: "security", label: "24-hour security", category: "Most popular", icon: ShieldCheck, legacyLabels: ["Security", "24-hour security"] },
  { id: "power", label: "24-hour power", category: "Most popular", icon: Zap, legacyLabels: ["24-hour power", "Backup power", "Reliable power"] },
  { id: "water_supply", label: "Water supply", category: "Most popular", icon: Droplets, legacyLabels: ["Water supply", "Clean water"] },
  { id: "air_conditioning", label: "Air conditioning", category: "Most popular", icon: Wind, legacyLabels: ["Air conditioning", "AC"] },
  { id: "furnished", label: "Furnished", category: "Most popular", icon: Sofa, legacyLabels: ["Furnished"] },
  { id: "family_friendly", label: "Family friendly", category: "Most popular", icon: UsersRound, legacyLabels: ["Family friendly"] },

  { id: "gated_compound", label: "Gated compound", category: "Property & building", icon: Fence, legacyLabels: ["Gated compound", "Private compound"] },
  { id: "estate_security", label: "Estate security", category: "Property & building", icon: Shield, legacyLabels: ["Estate security", "Serviced estate"] },
  { id: "cctv", label: "CCTV", category: "Property & building", icon: Cctv, legacyLabels: ["CCTV", "Surveillance"] },
  { id: "security_gate", label: "Security gate", category: "Property & building", icon: DoorOpen, legacyLabels: ["Security gate", "Secure compound"] },
  { id: "elevator", label: "Elevator", category: "Property & building", icon: Building2, legacyLabels: ["Elevator", "Lift"] },
  { id: "balcony", label: "Balcony", category: "Property & building", icon: House, legacyLabels: ["Balcony"] },
  { id: "fitted_kitchen", label: "Fitted kitchen", category: "Property & building", icon: CookingPot, legacyLabels: ["Fitted kitchen"] },
  { id: "modern_kitchen", label: "Modern kitchen", category: "Property & building", icon: Utensils, legacyLabels: ["Modern kitchen"] },
  { id: "dining_area", label: "Dining area", category: "Property & building", icon: Utensils, legacyLabels: ["Dining area"] },
  { id: "living_room", label: "Living room", category: "Property & building", icon: Armchair, legacyLabels: ["Living room"] },
  { id: "ensuite", label: "Ensuite bedrooms", category: "Property & building", icon: Bath, legacyLabels: ["Ensuite", "Ensuite bedrooms"] },
  { id: "guest_toilet", label: "Guest toilet", category: "Property & building", icon: Toilet, legacyLabels: ["Guest toilet"] },
  { id: "water_heater", label: "Water heater", category: "Property & building", icon: Thermometer, legacyLabels: ["Water heater"] },
  { id: "wardrobe", label: "Wardrobe", category: "Property & building", icon: Shirt, legacyLabels: ["Wardrobe", "Fitted wardrobes"] },
  { id: "pop_ceiling", label: "POP ceiling", category: "Property & building", icon: Layers, legacyLabels: ["POP ceiling"] },
  { id: "tiled_floors", label: "Tiled floors", category: "Property & building", icon: Grid2X2, legacyLabels: ["Tiled floors"] },

  { id: "laundry", label: "Laundry", category: "Convenience & utilities", icon: WashingMachine, legacyLabels: ["Laundry"] },
  { id: "prepaid_meter", label: "Prepaid meter", category: "Convenience & utilities", icon: Gauge, legacyLabels: ["Prepaid meter"] },
  { id: "generator", label: "Generator", category: "Convenience & utilities", icon: Zap, legacyLabels: ["Generator"] },
  { id: "inverter", label: "Inverter", category: "Convenience & utilities", icon: BatteryCharging, legacyLabels: ["Inverter"] },
  { id: "borehole", label: "Borehole", category: "Convenience & utilities", icon: Droplets, legacyLabels: ["Borehole"] },
  { id: "visitor_parking", label: "Visitors parking", category: "Convenience & utilities", icon: Car, legacyLabels: ["Visitors parking", "Visitor parking"] },
  { id: "serviced", label: "Serviced property", category: "Convenience & utilities", icon: Building2, legacyLabels: ["Serviced property"] },

  { id: "newly_built", label: "Newly built", category: "More features", icon: HousePlus, legacyLabels: ["Newly built"] },
  { id: "covered_parking", label: "Covered parking", category: "More features", icon: CarFront, legacyLabels: ["Covered parking"] },
  { id: "garden", label: "Garden", category: "More features", icon: Trees, legacyLabels: ["Garden", "Garden space"] },
  { id: "paved_compound", label: "Paved compound", category: "More features", icon: BrickWall, legacyLabels: ["Paved compound"] },
] satisfies FacilityDefinition[];

export type FacilityId = (typeof facilityCatalogue)[number]["id"];
export const facilityCategories = [...new Set(facilityCatalogue.map((facility) => facility.category))];

const facilityIds = new Set<string>(facilityCatalogue.map((facility) => facility.id));

export function isFacilityId(value: unknown): value is FacilityId {
  return typeof value === "string" && facilityIds.has(value);
}

export function getLegacyFacilityIds(features: string[]): FacilityId[] {
  const featureValues = new Set(features.map((feature) => feature.trim().toLocaleLowerCase("en")));
  return facilityCatalogue
    .filter((facility) => facility.legacyLabels?.some((label) => featureValues.has(label.toLocaleLowerCase("en"))))
    .map((facility) => facility.id);
}

export function resolveFacilityIds(facilities: unknown, legacyFeatures: string[] = []): FacilityId[] {
  return Array.isArray(facilities)
    ? [...new Set(facilities.filter(isFacilityId))]
    : getLegacyFacilityIds(legacyFeatures);
}