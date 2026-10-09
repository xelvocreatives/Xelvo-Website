"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leftLinks = [
    { title: "About", href: "#about" },
    { title: "Services", href: "#services" },
    { title: "Featured", href: "#featured" },
  ];

  const rightLinks = [
    { title: "Portfolio", href: "/portfolio" },
    { title: "Career", href: "/career" },
    { title: "Contact", href: "#contact" },
  ];

  const allLinks = [...leftLinks, ...rightLinks];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-4 bg-[rgba(11,11,11,0.95)]"
          : isMobileMenuOpen
            ? "py-6 bg-[rgba(11,11,11,0.95)]"
            : "py-6 lg:py-[40px] bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-8 lg:px-6 flex justify-between md:justify-center gap-[60px] items-center">
        {/* Left: Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 ">
          {leftLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-[14px] font-medium text-white/80 hover:text-[#FF6600] transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Center: Logo */}
        <div className=" flex justify-center">
          <Link href="/">
            <Image
              src="/images/brand-logo.png"
              alt="Brand Logo"
              width={100}
              height={100}
            />
          </Link>
        </div>

        {/* Right: Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center justify-end gap-8 ">
          {rightLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-[14px] font-medium text-white/80 hover:text-[#FF6600] transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-[70px] bg-[#0B0B0B] z-40 lg:hidden transition-all duration-300 transform ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-8 pt-12">
          {allLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-xl font-medium text-white hover:text-[#FF6600]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
