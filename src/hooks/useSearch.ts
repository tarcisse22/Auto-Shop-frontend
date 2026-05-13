"use client";

import { useState, useMemo } from "react";
import { searchCars } from "@/data/cars";
import { Car } from "@/types/car";

export function useSearch() {
  const [query, setQuery] = useState("");

  const results: Car[] = useMemo(() => {
    if (query.length < 2) return [];
    return searchCars(query);
  }, [query]);

  return { query, setQuery, results };
}
