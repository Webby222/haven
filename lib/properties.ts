export type PropertyPurpose = "sale" | "rent";

export type Property = {
  id: string;
  title: string;
  purpose: PropertyPurpose;
  propertyType: "Apartment" | "Flat" | "Mini Flat" | "Self Contain" | "Duplex" | "Serviced Apartment" | "Estate";
  location: string;
  city: string;
  price: string;
  priceValue: number;
  pricePeriod: "year" | "sale";
  bedrooms: number;
  bathrooms: number;
  parking: string;
  furnished: boolean;
  serviced: boolean;
  featured: boolean;
  area: string;
  image: string;
  imageAlt: string;
  description: string;
  features: string[];
};

const baseImages = {
  living: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=88",
  kitchen: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=88",
  duplex: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=88",
  bedroom: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=88",
  apartment: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=88",
  interior: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=88",
};

export const properties: Property[] = [
  {
    id: "modern-2-bedroom-flat-ugbowo", title: "Modern 2 Bedroom Flat", purpose: "rent", propertyType: "Flat", location: "Ugbowo", city: "Benin City", price: "₦1,500,000 / year", priceValue: 1500000, pricePeriod: "year", bedrooms: 2, bathrooms: 2, parking: "Parking", furnished: false, serviced: false, featured: true, area: "120 m²", image: baseImages.living, imageAlt: "Bright open-plan living room in a modern Nigerian-style flat", description: "A well-planned flat in a connected Ugbowo neighbourhood, with comfortable everyday living spaces.", features: ["Parking", "Estate security", "Fitted kitchen"],
  },
  {
    id: "serviced-3-bedroom-apartment-gra", title: "Serviced 3 Bedroom Apartment", purpose: "rent", propertyType: "Serviced Apartment", location: "GRA", city: "Benin City", price: "₦3,200,000 / year", priceValue: 3200000, pricePeriod: "year", bedrooms: 3, bathrooms: 3, parking: "Parking", furnished: true, serviced: true, featured: true, area: "180 m²", image: baseImages.kitchen, imageAlt: "Polished kitchen and living area in a serviced apartment", description: "A polished serviced apartment with generous rooms and the convenience of managed living in GRA.", features: ["Furnished", "24-hour power", "Parking"],
  },
  {
    id: "4-bedroom-duplex-airport-road", title: "4 Bedroom Duplex", purpose: "rent", propertyType: "Duplex", location: "Airport Road", city: "Benin City", price: "₦4,500,000 / year", priceValue: 4500000, pricePeriod: "year", bedrooms: 4, bathrooms: 4, parking: "Parking", furnished: false, serviced: false, featured: false, area: "260 m²", image: baseImages.duplex, imageAlt: "Contemporary duplex with a gated compound and driveway", description: "A spacious family duplex with private compound space and easy access to Airport Road.", features: ["Gated compound", "Parking", "Security"],
  },
  {
    id: "newly-built-mini-flat-sapele-road", title: "Newly Built Mini Flat", purpose: "rent", propertyType: "Mini Flat", location: "Sapele Road", city: "Benin City", price: "₦900,000 / year", priceValue: 900000, pricePeriod: "year", bedrooms: 1, bathrooms: 1, parking: "Parking", furnished: false, serviced: false, featured: false, area: "75 m²", image: baseImages.bedroom, imageAlt: "Compact, newly finished mini flat bedroom", description: "A compact newly built mini flat suited to simple, practical city living near Sapele Road.", features: ["Newly built", "Parking", "Water supply"],
  },
  {
    id: "modern-2-bedroom-apartment-ikpoba-hill", title: "Modern 2 Bedroom Apartment", purpose: "rent", propertyType: "Apartment", location: "Ikpoba Hill", city: "Benin City", price: "₦1,200,000 / year", priceValue: 1200000, pricePeriod: "year", bedrooms: 2, bathrooms: 2, parking: "Parking", furnished: false, serviced: false, featured: false, area: "125 m²", image: baseImages.apartment, imageAlt: "Modern two-bedroom apartment living area", description: "A calm two-bedroom apartment with a bright living area in an established Ikpoba Hill setting.", features: ["Parking", "Fitted kitchen", "Security"],
  },
  {
    id: "luxury-3-bedroom-flat-lekki", title: "Luxury 3 Bedroom Flat", purpose: "rent", propertyType: "Flat", location: "Lekki", city: "Lagos", price: "₦4,800,000 / year", priceValue: 4800000, pricePeriod: "year", bedrooms: 3, bathrooms: 3, parking: "Parking", furnished: true, serviced: true, featured: true, area: "210 m²", image: baseImages.interior, imageAlt: "Spacious serviced apartment interior with warm finishes", description: "A polished serviced flat with generous entertaining spaces in a secure Lekki development.", features: ["Furnished", "Estate security", "Backup power"],
  },
  {
    id: "modern-2-bedroom-apartment-ikeja", title: "Modern 2 Bedroom Apartment", purpose: "rent", propertyType: "Apartment", location: "Ikeja", city: "Lagos", price: "₦2,800,000 / year", priceValue: 2800000, pricePeriod: "year", bedrooms: 2, bathrooms: 2, parking: "Parking", furnished: false, serviced: false, featured: false, area: "140 m²", image: baseImages.duplex, imageAlt: "Modern apartment frontage with covered parking", description: "A modern apartment with practical proportions and covered parking in Ikeja.", features: ["Covered parking", "Water supply", "Security"],
  },
  {
    id: "4-bedroom-family-duplex-abuja", title: "4 Bedroom Family Duplex", purpose: "rent", propertyType: "Duplex", location: "Maitama", city: "Abuja", price: "₦6,500,000 / year", priceValue: 6500000, pricePeriod: "year", bedrooms: 4, bathrooms: 5, parking: "Parking", furnished: false, serviced: false, featured: false, area: "320 m²", image: baseImages.interior, imageAlt: "Large family duplex with a paved residential compound", description: "A large family duplex with room for entertaining and a paved compound in Maitama.", features: ["Paved compound", "Parking", "Security"],
  },
  {
    id: "4-bedroom-duplex-gra-sale", title: "4 Bedroom Duplex", purpose: "sale", propertyType: "Duplex", location: "GRA", city: "Benin City", price: "₦45,000,000", priceValue: 45000000, pricePeriod: "sale", bedrooms: 4, bathrooms: 4, parking: "Parking", furnished: false, serviced: false, featured: true, area: "380 m²", image: baseImages.duplex, imageAlt: "Modern Benin City duplex with secure compound frontage", description: "A substantial GRA duplex with a secure compound and room to grow into.", features: ["Secure compound", "Parking", "Garden space"],
  },
  {
    id: "modern-3-bedroom-apartment-lekki-sale", title: "Modern 3 Bedroom Apartment", purpose: "sale", propertyType: "Apartment", location: "Lekki", city: "Lagos", price: "₦38,000,000", priceValue: 38000000, pricePeriod: "sale", bedrooms: 3, bathrooms: 3, parking: "Parking", furnished: false, serviced: true, featured: true, area: "220 m²", image: baseImages.apartment, imageAlt: "Modern Lagos apartment living room with generous windows", description: "A contemporary three-bedroom apartment in a serviced Lekki development.", features: ["Serviced estate", "Parking", "Backup power"],
  },
  {
    id: "family-duplex-abuja-sale", title: "Family Duplex", purpose: "sale", propertyType: "Estate", location: "Maitama", city: "Abuja", price: "₦65,000,000", priceValue: 65000000, pricePeriod: "sale", bedrooms: 4, bathrooms: 5, parking: "Parking", furnished: false, serviced: false, featured: false, area: "420 m²", image: baseImages.interior, imageAlt: "Abuja family duplex interior with contemporary finishes", description: "A generous Abuja family home with multiple living areas and a private compound.", features: ["Private compound", "Parking", "Security"],
  },
  {
    id: "contemporary-apartment-port-harcourt", title: "Contemporary Apartment", purpose: "sale", propertyType: "Apartment", location: "Old GRA", city: "Port Harcourt", price: "₦28,000,000", priceValue: 28000000, pricePeriod: "sale", bedrooms: 3, bathrooms: 3, parking: "Parking", furnished: false, serviced: false, featured: false, area: "195 m²", image: baseImages.kitchen, imageAlt: "Contemporary apartment kitchen and living space in Port Harcourt", description: "A clean, contemporary apartment with comfortable proportions in Old GRA.", features: ["Fitted kitchen", "Parking", "Water supply"],
  },
  {
    id: "modern-flat-ibadan", title: "Modern 2 Bedroom Flat", purpose: "sale", propertyType: "Flat", location: "Jericho", city: "Ibadan", price: "₦22,000,000", priceValue: 22000000, pricePeriod: "sale", bedrooms: 2, bathrooms: 2, parking: "Parking", furnished: false, serviced: false, featured: false, area: "135 m²", image: baseImages.bedroom, imageAlt: "Modern two-bedroom flat interior in Ibadan", description: "A practical two-bedroom flat with a quiet residential feel in Jericho, Ibadan.", features: ["Parking", "Estate security", "Water supply"],
  },
];
