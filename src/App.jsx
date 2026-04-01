import { Wrench, Car, Zap, ShieldCheck, Phone } from "lucide-react";

export default function App() {
  const BUSINESS = {
    name: "Ciza Auto Service",
    phone: "(470) 298-4877",
    phoneLink: "tel:+14702984877",
    email: "cizaautostore@gmail.com",
  };

  const INVENTORY = [
    {
      title: "2016 Nissan Rogue (FWD)",
      mileage: "140,000 miles",
      items: ["Transmissions (2 available) — $800 each"],
    },
    {
      title: "2013 Ford Taurus (V6)",
      mileage: "140,000 miles",
      items: [
        "Engine — $1,000",
        "Transmission — $750",
        "Alternator — $140",
        "Starter — $90",
      ],
    },
    {
      title: "2015 Acura TLX (Package Deal)",
      mileage: "110,000 miles",
      items: [
        "Engine + Transmission + Alternator + Computer + Starter — $2,200",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔥 NAVBAR */}
      <div className="fixed top-0 w-full bg-black text-white z-50 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="font-bold text-lg">{BUSINESS.name}</h1>
          <div className="flex gap-6 text-sm">
            <a href="#home" className="hover:text-orange-400">Home</a>
            <a href="#inventory" className="hover:text-orange-400">Inventory</a>
            <a href="#services" className="hover:text-orange-400">Services</a>
            <a href="#book" className="hover:text-orange-400">Book</a>
          </div>
        </div>
      </div>

      {/* 🔥 HERO (UPGRADED) */}
      <div id="home" className="relative h-[650px] flex items-center justify-center text-center text-white mt-16">

        <img
          src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2"
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute w-full h-full bg-black/80"></div>

        <div className="relative z-10 px-6 max-w-xl w-full">

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Ciza Auto Service Center
          </h1>

          <p className="text-gray-300 mb-6">
            Mechanical • Body Repair • Installations • Mobile Services
          </p>

          {/* 🔥 BUTTON STACK */}
          <div className="flex flex-col gap-4">

            <a
              href={BUSINESS.phoneLink}
              className="bg-orange-500 py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition"
            >
              CALL NOW
            </a>

            <button className="border border-white py-4 rounded-lg font-bold hover:bg-white hover:text-black transition">
              GET A QUOTE
            </button>

            <a
              href="#book"
              className="border border-gray-400 py-4 rounded-lg font-bold hover:bg-white hover:text-black transition"
            >
              BOOK APPOINTMENT
            </a>

          </div>

          {/* 🔥 STATUS */}
          <div className="mt-6 text-sm space-y-2">

            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Available 24/7
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              24/7 Towing Available
            </div>

            <div className="flex items-center justify-center gap-2">
              <Phone size={16} />
              {BUSINESS.phone}
            </div>

          </div>

        </div>
      </div>

      {/* 🔧 INVENTORY */}
      <div id="inventory" className="p-10 bg-white">
        <h1 className="text-3xl font-bold text-center mb-2">
          Auto Parts & Inventory
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Call to confirm availability and compatibility
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {INVENTORY.map((car, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
              <h2 className="text-xl font-bold">{car.title}</h2>
              <p className="text-gray-500 mb-4">Mileage: {car.mileage}</p>

              <ul className="mb-4 space-y-1">
                {car.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>

              <div className="flex gap-2">
                <a href={BUSINESS.phoneLink} className="bg-gray-900 text-white px-4 py-2 rounded w-full text-center">Call</a>
                <a href={`mailto:${BUSINESS.email}`} className="border px-4 py-2 rounded w-full text-center">Email</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🛠 SERVICES */}
      <div id="services" className="p-10 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "General Auto Repair", desc: "Oil changes, brakes, diagnostics, and more.", icon: <Wrench className="mx-auto text-orange-500 mb-4" /> },
            { title: "Body & Collision", desc: "Accident repairs and body work.", icon: <Car className="mx-auto text-orange-500 mb-4" /> },
            { title: "Electronics", desc: "Cameras, audio systems, installs.", icon: <Zap className="mx-auto text-orange-500 mb-4" /> },
            { title: "Mobile Mechanic", desc: "On-site help and diagnostics.", icon: <ShieldCheck className="mx-auto text-orange-500 mb-4" /> },
          ].map((service, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center">
              {service.icon}
              <h3 className="font-bold">{service.title}</h3>
              <p className="text-sm text-gray-500">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 📞 BOOKING */}
      <div id="book" className="p-12 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">Book an Appointment</h2>
        <p className="text-gray-500 mb-6">Available 24/7 — Fast and easy booking by phone</p>

        <a
          href={BUSINESS.phoneLink}
          className="bg-orange-500 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-orange-600"
        >
          Call to Book Now
        </a>
      </div>

    </div>
  );
}




