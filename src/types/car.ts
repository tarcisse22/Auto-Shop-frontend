export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  category: "hypercar" | "german" | "jdm" | "supercar" | "exotic";
  heroImage: string;
  gallery: string[];
  specs: {
    engine: string;
    horsepower: number;
    torque: string;
    transmission: string;
    drivetrain: string;
    weight: string;
    topSpeed: string;
    zeroToSixty: string;
    productionNumbers: string;
    msrp: string;
  };
  description: string;
  tags: string[];
}

export interface CompareItem {
  carId: string;
}

export type CategoryType = "hypercar" | "german" | "jdm" | "supercar" | "exotic";
