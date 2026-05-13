"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-apex-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-apex-accent rounded-sm flex items-center justify-center">
                <span className="font-heading font-black text-white text-xs">A</span>
              </div>
              <span className="font-heading font-bold text-lg tracking-[0.2em]">
                APEX<span className="text-apex-accent">MOTORS</span>
              </span>
            </Link>
            <p className="text-apex-gray text-sm max-w-md leading-relaxed">
              The ultimate destination for high-performance automotive
              enthusiasts. Explore the world&apos;s most exclusive vehicles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-xs tracking-[0.2em] text-apex-light mb-4">
              CATEGORIES
            </h3>
            <div className="space-y-2">
              {[
                { href: "/#hypercars", label: "Hypercars" },
                { href: "/#german", label: "German Performance" },
                { href: "/#jdm", label: "JDM Legends" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-apex-gray hover:text-apex-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-heading font-bold text-xs tracking-[0.2em] text-apex-light mb-4">
              TOOLS
            </h3>
            <div className="space-y-2">
              {[
                { href: "/search?q=", label: "Search Cars" },
                { href: "/compare", label: "Compare" },
                { href: "/favorites", label: "Favorites" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-apex-gray hover:text-apex-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-apex-gray">
            &copy; {new Date().getFullYear()} Apex Motors. Built by Tarcisse Ndjibu.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/tarcisse22"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apex-gray hover:text-apex-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/tarcisse-ndjibu-5a0438294"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apex-gray hover:text-apex-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:ndjibutarcisse@gmail.com"
              className="text-apex-gray hover:text-apex-white transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
