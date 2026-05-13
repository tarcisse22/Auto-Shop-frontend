"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, X, Zap, Gauge, Timer, Cog, Weight, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cars, getCarById } from "@/data/cars";
import { Car } from "@/types/car";

function CompareContent() {
  const searchParams = useSearchParams();
  const carsParam = searchParams.get("cars") || "";
  const carIds = useMemo(() => carsParam.split(",").filter(Boolean), [carsParam]);

  const selectedCars: Car[] = useMemo(() => {
    return carIds.map((id) => getCarById(id)).filter(Boolean) as Car[];
  }, [carIds]);

  const specRows = [
    { label: "Engine", key: "engine" as const, icon: Cog },
    { label: "Horsepower", key: "horsepower" as const, icon: Zap },
    { label: "Torque", key: "torque" as const, icon: Cog },
    { label: "Top Speed", key: "topSpeed" as const, icon: Gauge },
    { label: "0-60 MPH", key: "zeroToSixty" as const, icon: Timer },
    { label: "Transmission", key: "transmission" as const, icon: Cog },
    { label: "Drivetrain", key: "drivetrain" as const, icon: Cog },
    { label: "Weight", key: "weight" as const, icon: Weight },
    { label: "Production", key: "productionNumbers" as const, icon: Cog },
    { label: "MSRP", key: "msrp" as const, icon: DollarSign },
  ];

  const getBestValue = (key: keyof Car["specs"]): string | number | null => {
    if (selectedCars.length < 2) return null;
    if (key === "horsepower") {
      return Math.max(...selectedCars.map((c) => c.specs.horsepower));
    }
    if (key === "topSpeed") {
      return Math.max(...selectedCars.map((c) => parseInt(c.specs.topSpeed)));
    }
    if (key === "zeroToSixty") {
      return Math.min(...selectedCars.map((c) => parseFloat(c.specs.zeroToSixty)));
    }
    return null;
  };

  const isBest = (car: Car, key: keyof Car["specs"]): boolean => {
    const best = getBestValue(key);
    if (best === null) return false;
    if (key === "horsepower") return car.specs.horsepower === best;
    if (key === "topSpeed") return parseInt(car.specs.topSpeed) === best;
    if (key === "zeroToSixty") return parseFloat(car.specs.zeroToSixty) === best;
    return false;
  };

  return (
    <main className="min-h-screen bg-apex-black">
      <Navbar />

      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-apex-gray hover:text-apex-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
            <h1 className="font-heading font-black text-3xl md:text-5xl text-apex-white mb-2">
              COMPARE
            </h1>
            <p className="text-apex-gray text-sm">
              Side-by-side comparison of up to 3 vehicles.
            </p>
          </motion.div>

          {selectedCars.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Plus className="w-16 h-16 text-apex-gray/30 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl text-apex-gray mb-2">
                No cars selected
              </h3>
              <p className="text-sm text-apex-gray/60 mb-6">
                Add cars to compare from the collection page.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-apex-accent text-white font-heading font-bold text-sm tracking-wider rounded-sm hover:bg-red-700 transition-colors"
              >
                BROWSE COLLECTION
              </Link>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                {/* Car Headers */}
                <thead>
                  <tr>
                    <th className="w-48 p-4" />
                    {selectedCars.map((car) => (
                      <th key={car.id} className="p-4 text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass rounded-xl p-4"
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                            <img
                              src={car.heroImage}
                              alt={car.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-apex-gray mb-1">{car.brand}</p>
                          <h3 className="font-heading font-bold text-sm text-apex-white">
                            {car.name}
                          </h3>
                          <Link
                            href={`/compare?cars=${carIds.filter((id) => id !== car.id).join(",")}`}
                            className="mt-2 inline-flex items-center gap-1 text-xs text-apex-gray hover:text-apex-accent transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </Link>
                        </motion.div>
                      </th>
                    ))}
                    {selectedCars.length < 3 && (
                      <th className="p-4 text-center">
                        <Link
                          href="/"
                          className="block glass rounded-xl p-8 border-2 border-dashed border-white/10 hover:border-apex-accent/30 transition-colors"
                        >
                          <Plus className="w-8 h-8 text-apex-gray mx-auto mb-2" />
                          <span className="text-xs text-apex-gray">Add Car</span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Spec Rows */}
                <tbody>
                  {specRows.map((spec, rowIdx) => (
                    <motion.tr
                      key={spec.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rowIdx * 0.05 }}
                      className="border-t border-white/5"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <spec.icon className="w-4 h-4 text-apex-gray" />
                          <span className="text-xs text-apex-gray tracking-wider uppercase">
                            {spec.label}
                          </span>
                        </div>
                      </td>
                      {selectedCars.map((car) => {
                        const value =
                          spec.key === "horsepower"
                            ? `${car.specs[spec.key]} HP`
                            : car.specs[spec.key];
                        const best = isBest(car, spec.key);
                        return (
                          <td key={car.id} className="p-4 text-center">
                            <span
                              className={`text-sm font-medium ${
                                best ? "text-apex-accent font-bold" : "text-apex-light"
                              }`}
                            >
                              {value}
                              {best && " ★"}
                            </span>
                          </td>
                        );
                      })}
                      {selectedCars.length < 3 && <td />}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Quick add suggestions */}
          {selectedCars.length > 0 && selectedCars.length < 3 && (
            <div className="mt-12">
              <h3 className="font-heading font-bold text-lg text-apex-white mb-4">
                Add to Compare
              </h3>
              <div className="flex flex-wrap gap-2">
                {cars
                  .filter((c) => !carIds.includes(c.id))
                  .slice(0, 8)
                  .map((car) => (
                    <Link
                      key={car.id}
                      href={`/compare?cars=${[...carIds, car.id].join(",")}`}
                      className="flex items-center gap-2 glass rounded-full px-3 py-2 hover:border-apex-accent/30 transition-all"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img
                          src={car.heroImage}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-apex-light">{car.name}</span>
                      <Plus className="w-3 h-3 text-apex-gray" />
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-apex-black flex items-center justify-center">
          <div className="font-heading text-apex-gray">Loading...</div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
