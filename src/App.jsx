import { useEffect, useMemo, useState } from "react";
import { Wrench, Car, Zap, ShieldCheck, Phone, LogIn, LogOut, Pencil, Trash2, X } from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import "./App.css";

const OWNER_EMAILS = ["odinramadan@gmail.com"];

const BUSINESS = {
  name: "Ciza Auto Service",
  phone: "(470) 298-4877",
  phoneLink: "tel:+14702984877",
  email: "cizaautostore@gmail.com",
  address: "6201 Memorial Dr, Stone Mountain, GA 30083",
  mapsLink:
    "https://www.google.com/maps/dir/?api=1&destination=6201+Memorial+Dr,+Stone+Mountain,+GA+30083",
};

const SERVICES = [
  { title: "General Auto Repair", desc: "Oil changes, brakes, diagnostics, and full maintenance.", icon: Wrench },
  { title: "Body & Collision", desc: "Accident repair, panel work, and restoration support.", icon: Car },
  { title: "Electronics", desc: "Cameras, audio systems, and accessory installation.", icon: Zap },
  { title: "Mobile Mechanic", desc: "On-site diagnostics and support when you are stuck.", icon: ShieldCheck },
];

const SAMPLE_CARS = [
  { title: "2016 Nissan Rogue (FWD)", mileage: "140,000 miles", items: ["Transmission (2 available) - $800 each", "Starter - $95", "Alternator - $145"] },
  { title: "2013 Ford Taurus (V6)", mileage: "140,000 miles", items: ["Engine - $1,000", "Transmission - $750", "Alternator - $140", "Starter - $90"] },
  { title: "2015 Acura TLX (Package Deal)", mileage: "110,000 miles", items: ["Engine + Transmission + Alternator + Computer + Starter - $2,200"] },
  { title: "2018 Toyota Camry (SE)", mileage: "98,000 miles", items: ["Engine - $1,350", "Transmission - $950", "Front bumper - $220", "Radiator - $120"] },
  { title: "2014 Honda Accord (EX)", mileage: "125,000 miles", items: ["Engine - $1,100", "Transmission - $800", "AC compressor - $130", "Starter - $85"] },
];

const EMPTY_FORM = { title: "", mileage: "", partsText: "" };

function CarLineSVG() {
  return (
    <svg className="car-svg" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M30 80 L30 65 Q32 55 50 45 L95 30 Q110 24 140 23 L185 23 Q210 23 225 30 L268 45 Q285 52 290 65 L290 80" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M95 45 Q105 28 130 24 L185 24 Q210 24 222 40 L255 45" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      <path d="M100 45 L118 27" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M218 45 L204 27" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="80" x2="80" y2="80" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="118" y1="80" x2="202" y2="80" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="240" y1="80" x2="290" y2="80" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M290 65 L300 68 L300 82 L290 82" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 65 L20 68 L20 82 L30 82" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="245" cy="80" r="20" stroke="#f97316" strokeWidth="2.5"/>
      <circle cx="245" cy="80" r="9" stroke="#f97316" strokeWidth="1.5"/>
      <circle cx="75" cy="80" r="20" stroke="#f97316" strokeWidth="2.5"/>
      <circle cx="75" cy="80" r="9" stroke="#f97316" strokeWidth="1.5"/>
      <path d="M290 58 L298 60 L298 66 L290 65" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 58 L22 60 L22 66 L30 65" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="155" y1="28" x2="155" y2="78" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
      <line x1="175" y1="54" x2="188" y2="54" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="118" y1="54" x2="131" y2="54" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function parseParts(text) {
  return text.split("\n").map((item) => item.trim()).filter(Boolean);
}

function partsToText(parts) {
  if (!Array.isArray(parts)) return "";
  return parts.join("\n");
}

function sortCars(cars) {
  return [...cars].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

function toFriendlyError(error) {
  const code = error?.code || "";
  if (code === "permission-denied") return "Permission denied in Firestore rules. Add odinramadan@gmail.com to write rules.";
  if (code === "unauthenticated") return "You must be logged in as owner to add or edit cars.";
  return error?.message || "Request failed. Please try again.";
}

function withTimeout(promise, ms = 12000, label = "Request") {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out. Check internet or Firebase rules.`)), ms),
    ),
  ]);
}

export default function App() {
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [carsError, setCarsError] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginState, setLoginState] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [seedAttempted, setSeedAttempted] = useState(false);

  const isOwner = useMemo(() => {
    const email = user?.email?.toLowerCase();
    if (!email) return false;
    return OWNER_EMAILS.map((owner) => owner.toLowerCase()).includes(email);
  }, [user]);

  const loadCars = async () => {
    setCarsLoading(true);
    setCarsError("");
    try {
      const snapshot = await withTimeout(getDocs(collection(db, "cars")), 12000, "Loading inventory");
      const fetched = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      setCars(sortCars(fetched));
    } catch (error) {
      setCarsError(toFriendlyError(error));
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { loadCars(); }, []);

  useEffect(() => {
    const autoSeedCars = async () => {
      if (seedAttempted || carsLoading || !isOwner || cars.length > 0) return;
      setSeedAttempted(true);
      setCarsError("");
      try {
        await withTimeout(
          Promise.all(SAMPLE_CARS.map((car) => addDoc(collection(db, "cars"), { ...car, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }))),
          12000, "Seeding starter cars",
        );
        await loadCars();
      } catch (error) {
        setCarsError(toFriendlyError(error));
      }
    };
    autoSeedCars();
  }, [cars.length, carsLoading, isOwner, seedAttempted]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    setAuthBusy(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || loginState.email).trim();
    const password = String(formData.get("password") || loginState.password);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
      setLoginState({ email: "", password: "" });
    } catch (error) {
      setLoginError(error?.message || "Invalid login credentials.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    try {
      await signOut(auth);
      setEditingId("");
      setForm(EMPTY_FORM);
      setLoginError("");
      setLoginState((prev) => ({ ...prev, password: "" }));
      setShowLogin(true);
    } catch (error) {
      setLoginError(error?.message || "Could not log out. Please try again.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isOwner) { setSaveMessage("Owner account required to add or edit cars."); return; }

    const payload = {
      title: form.title.trim(),
      mileage: form.mileage.trim(),
      items: parseParts(form.partsText),
      updatedAt: serverTimestamp(),
    };

    if (!payload.title || !payload.mileage || payload.items.length === 0) {
      setSaveMessage("Please complete title, mileage, and at least one part.");
      return;
    }

    setSaveMessage("");
    setSaveBusy(true);

    try {
      if (editingId) {
        await withTimeout(updateDoc(doc(db, "cars", editingId), payload), 12000, "Updating car");
        setCars((prev) =>
          sortCars(prev.map((car) =>
            car.id === editingId ? { ...car, title: payload.title, mileage: payload.mileage, items: payload.items } : car,
          )),
        );
      } else {
        const newRef = await withTimeout(
          addDoc(collection(db, "cars"), { ...payload, createdAt: serverTimestamp() }),
          12000, "Adding car",
        );
        setCars((prev) =>
          sortCars([...prev, { id: newRef.id, title: payload.title, mileage: payload.mileage, items: payload.items }]),
        );
      }
      setEditingId("");
      setForm(EMPTY_FORM);
      setSaveMessage(editingId ? "Car updated." : "Car added.");
      loadCars();
    } catch (error) {
      const message = toFriendlyError(error);
      setCarsError(message);
      setSaveMessage(message);
    } finally {
      setSaveBusy(false);
    }
  };

  const handleEdit = (car) => {
    if (!isOwner) return;
    setEditingId(car.id);
    setForm({ title: car.title || "", mileage: car.mileage || "", partsText: partsToText(car.items) });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!isOwner) return;
    const ok = window.confirm("Delete this car from inventory?");
    if (!ok) return;
    try {
      await withTimeout(deleteDoc(doc(db, "cars", id)), 12000, "Deleting car");
      await loadCars();
    } catch (error) {
      setCarsError(toFriendlyError(error));
    }
  };

  const carsToDisplay = cars.length > 0 ? cars : SAMPLE_CARS;

  return (
    <div className="site">
      <header className="nav-shell">
        <nav className="nav container">
          <div className="brand">{BUSINESS.name}</div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#inventory">Inventory</a>
            <a href="#services">Services</a>
            <a href="#book">Book</a>
          </div>
          <div className="auth-area">
            {!authLoading && !user ? (
              <button className="ghost-btn" onClick={() => setShowLogin((v) => !v)}>
                <LogIn size={16} /> Owner Login
              </button>
            ) : null}
            {user ? (
              <>
                <span className="auth-user">{user.email}</span>
                <button className="ghost-btn" onClick={handleLogout} disabled={authBusy}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : null}
          </div>
        </nav>
      </header>

      {showLogin && !user ? (
        <section className="container login-panel">
          <form onSubmit={handleLogin} className="card">
            <div className="card-header">
              <h2>Owner Login</h2>
              <button type="button" className="icon-btn" onClick={() => setShowLogin(false)}>
                <X size={18} />
              </button>
            </div>
            {loginError ? <p className="error-text">{loginError}</p> : null}
            <label>
              Email
              <input type="email" name="email" autoComplete="email" value={loginState.email}
                onChange={(e) => setLoginState((prev) => ({ ...prev, email: e.target.value }))} required />
            </label>
            <label>
              Password
              <input type="password" name="password" autoComplete="current-password" value={loginState.password}
                onChange={(e) => setLoginState((prev) => ({ ...prev, password: e.target.value }))} required />
            </label>
            <button className="primary-btn" type="submit" disabled={authBusy}>
              {authBusy ? "Signing in..." : "Login"}
            </button>
          </form>
        </section>
      ) : null}

      <section id="home" className="hero">
        <img
          src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1600&q=80"
          alt="Auto service"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <h1>Ciza Auto Service Center</h1>
          <p>Mechanical, body repair, installations, and mobile service support.</p>
          <div className="hero-actions">
            <a className="primary-btn" href={BUSINESS.phoneLink}>Call Now</a>
            <a className="secondary-btn" href={`mailto:${BUSINESS.email}`}>Get a Quote</a>
            <a className="secondary-btn" href="#book">Book Appointment</a>
          </div>
          <div className="hero-meta">
            <span>Available 24/7</span>
            <span>24/7 Towing Available</span>
            <span><Phone size={16} /> {BUSINESS.phone}</span>
          </div>
        </div>
      </section>

      <section id="inventory" className="section container">
        <div className="section-title-row">
          <h2>Auto Parts Inventory</h2>
          {!authLoading && user && !isOwner ? (
            <p className="viewer-note">Signed in as viewer only. Owner permissions required to edit.</p>
          ) : null}
        </div>
        <p className="muted">Call to confirm availability and compatibility.</p>
        {carsError ? <p className="error-text">{carsError}</p> : null}
        {carsLoading ? <p className="muted">Loading inventory...</p> : null}
        {!carsLoading && cars.length === 0 ? (
          <div className="empty">
            <p>Showing starter inventory below. Owner can still login to add real cars anytime.</p>
          </div>
        ) : null}
        {!carsLoading ? (
          <div className="inventory-grid">
            {carsToDisplay.map((car, index) => (
              <article key={car.id || `sample-${index}`} className="card inventory-card">
                <div className="car-svg-wrap">
                  <CarLineSVG />
                </div>
                <div className="inventory-card-body">
                  <h3>{car.title}</h3>
                  <p className="muted">Mileage: {car.mileage}</p>
                  <ul>
                    {(car.items || []).map((item, idx) => (
                      <li key={`${car.id || `sample-${index}`}-${idx}`}>{item}</li>
                    ))}
                  </ul>
                  <div className="inventory-actions">
                    <a href={BUSINESS.phoneLink} className="primary-btn small-btn">Call</a>
                    <a href={`mailto:${BUSINESS.email}`} className="secondary-btn small-btn">Email</a>
                  </div>
                  {isOwner && cars.length > 0 ? (
                    <div className="owner-actions">
                      <button className="ghost-btn" onClick={() => handleEdit(car)}><Pencil size={15} /> Edit</button>
                      <button className="danger-btn" onClick={() => handleDelete(car.id)}><Trash2 size={15} /> Delete</button>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section id="services" className="section section-alt">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="card service-card">
                  <Icon size={26} />
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="book" className="section container center">
        <h2>Book an Appointment</h2>
        <p className="muted">Available 24/7. Fast booking by phone.</p>
        <a className="primary-btn" href={BUSINESS.phoneLink}>Call to Book Now</a>
      </section>

      {isOwner ? (
        <section className="section admin-section">
          <div className="container">
            <div className="card admin-card">
              <h2>{editingId ? "Update Car" : "Add Car"}</h2>
              <p className="muted">Owner tools: create, edit, and remove inventory.</p>
              {saveMessage ? <p className="muted">{saveMessage}</p> : null}
              <form onSubmit={handleSubmit} className="admin-form">
                <label>
                  Car Title
                  <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Example: 2018 Toyota Camry" required />
                </label>
                <label>
                  Mileage
                  <input value={form.mileage} onChange={(e) => setForm((prev) => ({ ...prev, mileage: e.target.value }))}
                    placeholder="Example: 85,000 miles" required />
                </label>
                <label>
                  Parts (one per line)
                  <textarea rows={6} value={form.partsText}
                    onChange={(e) => setForm((prev) => ({ ...prev, partsText: e.target.value }))}
                    placeholder={"Engine - $1,000\nTransmission - $700\nStarter - $90"} required />
                </label>
                <div className="owner-actions">
                  <button type="submit" className="primary-btn" disabled={saveBusy}>
                    {saveBusy ? "Saving..." : editingId ? "Update Car" : "Add Car"}
                  </button>
                  {editingId ? (
                    <button type="button" className="secondary-btn"
                      onClick={() => { setEditingId(""); setForm(EMPTY_FORM); }}>
                      Cancel Edit
                    </button>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      <footer className="location-footer">
        <div className="container location-inner">
          <div>
            <h3>Visit Us</h3>
            <p>{BUSINESS.address}</p>
          </div>
          <a className="primary-btn" href={BUSINESS.mapsLink} target="_blank" rel="noreferrer">Get Here</a>
        </div>
      </footer>
    </div>
  );
}




