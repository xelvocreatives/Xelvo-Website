import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaBehance,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "../public/images/brand-logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const linksStack: {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    links: { title: string; href: string; icon: any }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socialLinks?: { icon: any; href: string }[];
  }[] = [
    {
      title: "Navigation",
      links: [
        { title: "About", href: "#about", icon: null },
        { title: "Featured", href: "#featured", icon: null },
        { title: "Portfolio", href: "/portfolio", icon: null },
        { title: "Testimonials", href: "#testimonials", icon: null },
        { title: "Contact", href: "#contact", icon: null },
      ],
    },
    {
      title: "Services",
      links: [
        { title: "Brand Identity", href: "#services", icon: null },
        { title: "Social Graphics", href: "#services", icon: null },
        { title: "Web Design", href: "#services", icon: null },
        { title: "Marketing", href: "#services", icon: null },
      ],
    },
    {
      title: "Contact",
      links: [
        {
          title: "+92 319 0504566",
          icon: Phone,
          href: "https://wa.me/+923190504566",
        },
        {
          title: "hello@xelvocreatives.com",
          icon: Mail,
          href: "mailto:hello@xelvocreatives.com",
        },
        {
          title: "Islamabad Capital Territory",
          icon: MapPin,
          href: "https://www.google.com/maps/place/Islamabad+Capital+Territory",
        },
      ],
      socialLinks: [
        {
          icon: FaFacebookF,
          href: "https://www.facebook.com/xelvocreatives",
        },
        {
          icon: FaInstagram,
          href: "https://www.instagram.com/xelvocreatives/",
        },
        {
          icon: FaLinkedinIn,
          href: "https://www.linkedin.com/company/xelvocreatives/",
        },
        {
          icon: FaBehance,
          href: "https://www.behance.net/xelvocreatives",
        },
      ],
    },
  ];

  return (
    <footer className="pt-[56px] bg-[#222222]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row justify-between mb-16 gap-10 lg:gap-0">
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col gap-8 lg:gap-[85px]">
            <div className="max-w-[415px] flex flex-col gap-6 lg:gap-[36px]">
              <Image
                src={BrandLogo}
                alt="Xelvo Creatives"
                width={145}
                height={75}
              />

              <p className="text-[16px] font-medium leading-[24px] text-white">
                Shariah-compliant branding and marketing solutions that help
                Muslim businesses scale globally.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 sm:gap-[120px]">
            {linksStack.map((linkGroup, index) => (
              <div key={index} className="flex flex-col gap-6 lg:gap-[44px]">
                <h4 className="text-[16px] leading-[24px] font-bold text-[#FF6600]">
                  {linkGroup.title}
                </h4>
                <ul className="space-y-4">
                  {linkGroup.links.map((link, idx) => (
                    <li key={idx} className="flex items-center gap-[12px]">
                      {link.icon && (
                        <link.icon
                          size={20}
                          style={{ color: "#FF6600" }}
                          className="mt-0.5 shrink-0"
                        />
                      )}
                      <Link
                        href={link.href}
                        className="text-[14px] leading-[20px] font-medium text-white hover:text-[#FF6600] transition-colors duration-300"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {linkGroup.socialLinks && (
                  <div className="flex gap-4 -mt-[20px]">
                    {linkGroup.socialLinks.map((social, idx) => (
                      <Link
                        key={idx}
                        href={social.href}
                        target="_blank"
                        className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-[#FF6600]/30 bg-[#FF6600]/5 hover:bg-[#FF6600] group transition-all duration-300"
                      >
                        <social.icon
                          size={20}
                          className="text-[#FF6600] group-hover:text-white transition-colors"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-[30px] border-t border-white/70 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[14px] md:text-[16px] leading-[24px] font-medium text-white">
            Copyright© {currentYear} Xelvo Creatives. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-1 text-[14px] md:text-[16px] leading-[24px] font-medium text-white">
            <span>Developed with</span>
            <span className="text-red-500">❤️</span>
            <span>By:</span>
            <Link
              href="https://www.linkedin.com/in/imran-safdar/"
              target="_blank"
              className="text-white underline decoration-white hover:text-[#FF6600] hover:decoration-[#FF6600] transition-colors flex items-center gap-1"
            >
              Imran Safder
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
