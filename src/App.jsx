import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wrench, Car, Zap, ShieldCheck, Phone, LogIn, LogOut,
  Pencil, Trash2, X, Menu, Search, ArrowUp, Clock, MapPin, Mail,
  CheckCircle2, ChevronRight, Navigation, Truck,
} from "lucide-react";
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

const OWNER_EMAILS = ["cizaautostore@gmail.com"];

const BUSINESS = {
  name: "Ciza Auto Service",
  phone: "(470) 298-4877",
  phoneLink: "tel:+14702984877",
  email: "cizaautostore@gmail.com",
  address: "6201 Memorial Dr, Stone Mountain, GA 30083",
  mapsLink:
    "https://www.google.com/maps/dir/?api=1&destination=6201+Memorial+Dr,+Stone+Mountain,+GA+30083",
  hours: "Mon–Sun: Open 24/7",
  mapEmbed:
    "https://maps.google.com/maps?q=6201+Memorial+Dr,+Stone+Mountain,+GA+30083&z=15&output=embed",
  heroImage:
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80",
};

const SERVICES = [
  { title: "General Auto Repair", desc: "Oil changes, brakes, diagnostics, and full maintenance.", icon: Wrench },
  { title: "Body & Collision", desc: "Accident repair, panel work, and restoration support.", icon: Car },
  { title: "Electronics", desc: "Cameras, audio systems, and accessory installation.", icon: Zap },
  { title: "Mobile Mechanic", desc: "On-site diagnostics and support when you are stuck.", icon: ShieldCheck },
];

const EMPTY_FORM = { title: "", mileage: "", partsText: "" };

function SkeletonCard() {
  return (
    <article className="card inventory-card skeleton-card">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-subtitle" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-short" />
    </article>
  );
}

// "Engine - $1,000" -> { name: "Engine", price: "$1,000" }
function splitPart(item) {
  const idx = item.lastIndexOf(" - ");
  if (idx === -1 || !item.slice(idx + 3).includes("$")) return { name: item, price: "" };
  return { name: item.slice(0, idx), price: item.slice(idx + 3) };
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
  if (code === "permission-denied") return "Permission denied in Firestore rules. Add cizaautostore@gmail.com to write rules.";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

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
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

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

  const filteredCars = useMemo(() => {
    if (!searchQuery.trim()) return cars;
    const q = searchQuery.toLowerCase();
    return cars.filter(
      (car) =>
        (car.title || "").toLowerCase().includes(q) ||
        (car.mileage || "").toLowerCase().includes(q) ||
        (car.items || []).some((item) => item.toLowerCase().includes(q)),
    );
  }, [cars, searchQuery]);

  return (
    <div className="site">
      <div className="topbar">
        <div className="container topbar-inner">
          <span><MapPin size={14} /> {BUSINESS.address}</span>
          <span><Clock size={14} /> {BUSINESS.hours}</span>
          <a href={BUSINESS.phoneLink}><Phone size={14} /> {BUSINESS.phone}</a>
        </div>
      </div>

      <header className="nav-shell">
        <nav className="nav container">
          <a href="#home" className="brand" onClick={closeMenu}>
            <span className="brand-mark"><Wrench size={20} /></span>
            <span className="brand-text">
              <strong>CIZA</strong>
              <small>Auto Service</small>
            </span>
          </a>

          <div className={`nav-links${mobileMenuOpen ? " nav-links--open" : ""}`}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#inventory" onClick={closeMenu}>Used Parts</a>
            <a href="#book" onClick={closeMenu}>Book</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </div>

          <div className="nav-right">
            {user ? (
              <div className="auth-area">
                <span className="auth-user">{user.email}</span>
                <button className="ghost-btn" onClick={handleLogout} disabled={authBusy}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : null}
            <a className="primary-btn nav-call" href={BUSINESS.phoneLink}>
              <Phone size={16} /> <span>{BUSINESS.phone}</span>
            </a>
            <button
              className="mobile-menu-btn icon-btn"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileMenuOpen ? <div className="nav-backdrop" onClick={closeMenu} /> : null}

      {showLogin && !user ? (
        <section className="container login-panel animate-fade-in">
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
          src={BUSINESS.heroImage}
          alt="Mechanic working on a car in the shop"
          className="hero-image"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-text">
            <p className="eyebrow">Auto Repair &amp; Used Parts &middot; Stone Mountain, GA</p>
            <h1>Ciza Auto Service Center</h1>
            <p className="hero-subtitle">Mechanical, body repair, installations, and mobile service support.</p>
            <div className="hero-actions">
              <a className="primary-btn btn-lg" href={BUSINESS.phoneLink}><Phone size={18} /> Call Now</a>
              <a className="outline-light-btn btn-lg" href="#book">Book Appointment</a>
            </div>
            <ul className="hero-checks">
              <li><CheckCircle2 size={18} /> Open 24/7</li>
              <li><CheckCircle2 size={18} /> 24/7 Towing</li>
              <li><CheckCircle2 size={18} /> Mobile Mechanic</li>
            </ul>
          </div>

          <aside className="hero-card">
            <h2>Need help now?</h2>
            <p className="muted">Call or stop by any time, day or night.</p>
            <a className="hero-card-phone" href={BUSINESS.phoneLink}>
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <ul className="hero-card-list">
              <li><MapPin size={16} /> {BUSINESS.address}</li>
              <li><Clock size={16} /> {BUSINESS.hours}</li>
              <li><Mail size={16} /> {BUSINESS.email}</li>
            </ul>
            <div className="hero-card-actions">
              <a className="secondary-btn" href={BUSINESS.mapsLink} target="_blank" rel="noreferrer">
                <Navigation size={16} /> Directions
              </a>
              <a className="secondary-btn" href={`mailto:${BUSINESS.email}`}>
                <Mail size={16} /> Get a Quote
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="features-strip">
        <div className="container features-inner">
          <div className="feature"><Clock size={22} /><div><strong>Open 24/7</strong><span>Every day of the week</span></div></div>
          <div className="feature"><Truck size={22} /><div><strong>24/7 Towing</strong><span>We come get your car</span></div></div>
          <div className="feature"><MapPin size={22} /><div><strong>Mobile Mechanic</strong><span>On-site help when you&rsquo;re stuck</span></div></div>
          <div className="feature"><Wrench size={22} /><div><strong>Used Parts</strong><span>Engines, transmissions &amp; more</span></div></div>
        </div>
      </section>

      <section id="services" className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What We Do</p>
            <h2>Our Services</h2>
            <p className="muted">Professional auto care for every need.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="card service-card animate-card">
                  <div className="service-icon-wrap">
                    <Icon size={26} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <a href={BUSINESS.phoneLink} className="text-link">Call for a quote <ChevronRight size={16} /></a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="inventory" className="section section-alt">
        <div className="container">
          <div className="section-title-row">
            <div className="section-head section-head--left">
              <p className="eyebrow">Used Parts</p>
              <h2>Auto Parts Inventory</h2>
              <p className="muted">Call to confirm availability and compatibility.</p>
            </div>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by car, part, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery ? (
                <button className="search-clear icon-btn" onClick={() => setSearchQuery("")}>
                  <X size={16} />
                </button>
              ) : null}
            </div>
          </div>

          {!authLoading && user && !isOwner ? (
            <p className="viewer-note">Signed in as viewer only. Owner permissions required to edit.</p>
          ) : null}

          {carsError && isOwner ? <p className="error-text">{carsError}</p> : null}
          {carsError && !isOwner ? (
            <div className="empty">
              <p>Inventory couldn&rsquo;t load right now. Call <a href={BUSINESS.phoneLink}>{BUSINESS.phone}</a> for current parts and availability.</p>
            </div>
          ) : null}

          {carsLoading ? (
            <div className="inventory-grid">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : null}

          {!carsLoading && !carsError && cars.length === 0 ? (
            <div className="empty">
              <p>
                {isOwner
                  ? "No cars in inventory yet. Use the Add Car form below to add one."
                  : <>Inventory is being updated. Call <a href={BUSINESS.phoneLink}>{BUSINESS.phone}</a> for current parts and availability.</>}
              </p>
            </div>
          ) : null}

          {!carsLoading && filteredCars.length === 0 && searchQuery ? (
            <div className="empty">
              <p>No vehicles or parts match &ldquo;{searchQuery}&rdquo;. Try a different search.</p>
            </div>
          ) : null}

          {!carsLoading ? (
            <div className="inventory-grid">
              {filteredCars.map((car) => (
                <article key={car.id} className="card inventory-card animate-card">
                  <div className="inventory-card-head">
                    <span className="inventory-card-icon"><Car size={20} /></span>
                    <div>
                      <h3>{car.title}</h3>
                      <p className="mileage">{car.mileage}</p>
                    </div>
                  </div>
                  <ul className="parts-list">
                    {(car.items || []).map((item, idx) => {
                      const { name, price } = splitPart(item);
                      return (
                        <li key={`${car.id}-${idx}`}>
                          <span>{name}</span>
                          {price ? <strong>{price}</strong> : null}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="inventory-actions">
                    <a href={BUSINESS.phoneLink} className="primary-btn small-btn"><Phone size={14} /> Call</a>
                    <a href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Parts inquiry: ${car.title}`)}`} className="secondary-btn small-btn"><Mail size={14} /> Email</a>
                  </div>
                  {isOwner ? (
                    <div className="owner-actions">
                      <button className="ghost-btn" onClick={() => handleEdit(car)}><Pencil size={15} /> Edit</button>
                      <button className="danger-btn" onClick={() => handleDelete(car.id)}><Trash2 size={15} /> Delete</button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}

          {!carsLoading && filteredCars.length > 0 && searchQuery ? (
            <p className="muted search-results-count">{filteredCars.length} result{filteredCars.length !== 1 ? "s" : ""} found</p>
          ) : null}
        </div>
      </section>

      <section id="book" className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Book an Appointment</h2>
            <p>Available 24/7. Fast booking by phone or email.</p>
          </div>
          <div className="book-actions">
            <a className="dark-btn btn-lg" href={BUSINESS.phoneLink}><Phone size={18} /> Call to Book Now</a>
            <a className="outline-light-btn btn-lg" href={`mailto:${BUSINESS.email}?subject=Appointment Request`}><Mail size={18} /> Email Us</a>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <p className="eyebrow">Visit Us</p>
            <h2>Find the Shop</h2>
            <ul className="contact-list">
              <li>
                <span className="contact-icon"><MapPin size={20} /></span>
                <div><strong>Address</strong><a href={BUSINESS.mapsLink} target="_blank" rel="noreferrer">{BUSINESS.address}</a></div>
              </li>
              <li>
                <span className="contact-icon"><Phone size={20} /></span>
                <div><strong>Phone</strong><a href={BUSINESS.phoneLink}>{BUSINESS.phone}</a></div>
              </li>
              <li>
                <span className="contact-icon"><Mail size={20} /></span>
                <div><strong>Email</strong><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></div>
              </li>
              <li>
                <span className="contact-icon"><Clock size={20} /></span>
                <div><strong>Hours</strong><span>{BUSINESS.hours}</span></div>
              </li>
            </ul>
            <a className="primary-btn" href={BUSINESS.mapsLink} target="_blank" rel="noreferrer">
              <Navigation size={16} /> Get Directions
            </a>
          </div>
          <div className="map-wrap">
            <iframe
              title={`Map to ${BUSINESS.name}`}
              src={BUSINESS.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {isOwner ? (
        <section className="section admin-section animate-section">
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

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <a href="#home" className="brand brand--footer">
              <span className="brand-mark"><Wrench size={20} /></span>
              <span className="brand-text">
                <strong>CIZA</strong>
                <small>Auto Service</small>
              </span>
            </a>
            <p className="footer-desc">Your trusted auto service center in Stone Mountain, GA. Quality repairs, fair prices, and 24/7 availability.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#inventory">Used Parts</a>
            <a href="#book">Book Appointment</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            {SERVICES.map((service) => (
              <a key={service.title} href="#services">{service.title}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href={BUSINESS.phoneLink}><Phone size={14} /> {BUSINESS.phone}</a>
            <a href={`mailto:${BUSINESS.email}`}><Mail size={14} /> {BUSINESS.email}</a>
            <a href={BUSINESS.mapsLink} target="_blank" rel="noreferrer"><MapPin size={14} /> {BUSINESS.address}</a>
            <span><Clock size={14} /> {BUSINESS.hours}</span>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>&copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
          {!authLoading && !user ? (
            <button
              className="footer-login-btn"
              onClick={() => { setShowLogin(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              <LogIn size={14} /> Owner Login
            </button>
          ) : null}
        </div>
      </footer>

      <div className="mobile-call-bar">
        <a href={BUSINESS.phoneLink} className="primary-btn"><Phone size={18} /> Call Now</a>
        <a href={BUSINESS.mapsLink} target="_blank" rel="noreferrer" className="dark-btn"><Navigation size={18} /> Directions</a>
      </div>

      {showBackToTop ? (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      ) : null}
    </div>
  );
}
