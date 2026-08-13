
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden text-white">

      {/* ==========================================
          BACKGROUND IMAGE
      ========================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${assets.footerBg})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />


      {/* ==========================================
          MAIN FOOTER CONTENT
      ========================================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">


          {/* ========================================
              BRAND SECTION
          ======================================== */}
          <div className="max-w-md">

            <img
              src={assets.logo}
              className="mb-6 w-36 object-contain brightness-0 invert"
              alt="Forever You"
            />

            <p className="text-sm leading-7 text-gray-300">
              Discover timeless fashion designed for modern
              lifestyles. From everyday essentials to
              statement pieces, find styles that reflect
              who you are.
            </p>


            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-black"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-black"
              >
                <FaInstagram size={17} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-black"
              >
                <FaTwitter size={16} />
              </a>

            </div>

          </div>


          {/* ========================================
              COMPANY LINKS
          ======================================== */}
          <div>

            <h3 className="mb-6 text-sm font-bold tracking-wider text-white">
              COMPANY
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">

              <li>
                <a href="/" className="transition hover:text-white">
                  Home
                </a>
              </li>

              <li>
                <a href="/about" className="transition hover:text-white">
                  About Us
                </a>
              </li>

              <li>
                <a href="/delivery" className="transition hover:text-white">
                  Delivery Information
                </a>
              </li>

              <li>
                <a
                  href="/privacy-policy"
                  className="transition hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>

            </ul>

          </div>


          {/* ========================================
              CUSTOMER SERVICE
          ======================================== */}
          <div>

            <h3 className="mb-6 text-sm font-bold tracking-wider text-white">
              CUSTOMER SERVICE
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">

              <li>
                <a href="/contact" className="transition hover:text-white">
                  Contact Us
                </a>
              </li>

              <li>
                <a href="/orders" className="transition hover:text-white">
                  Track Your Order
                </a>
              </li>

              <li>
                <a href="/returns" className="transition hover:text-white">
                  Returns & Exchanges
                </a>
              </li>

              <li>
                <a href="/faq" className="transition hover:text-white">
                  FAQs
                </a>
              </li>

            </ul>

          </div>


          {/* ========================================
              CONTACT SECTION
          ======================================== */}
          <div>

            <h3 className="mb-6 text-sm font-bold tracking-wider text-white">
              GET IN TOUCH
            </h3>

            <ul className="space-y-5 text-sm text-gray-400">

              {/* Phone */}
              <li className="flex items-start gap-3">

                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-white"
                />

                <div>
                  <p className="font-medium text-white">
                    Call Us
                  </p>

                  <p className="mt-1">
                    +91 98765 43210
                  </p>
                </div>

              </li>


              {/* Email */}
              <li className="flex items-start gap-3">

                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-white"
                />

                <div>
                  <p className="font-medium text-white">
                    Email Us
                  </p>

                  <p className="mt-1">
                    contact@foreveryou.com
                  </p>
                </div>

              </li>


              {/* Location */}
              <li className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-white"
                />

                <div>
                  <p className="font-medium text-white">
                    Our Store
                  </p>

                  <p className="mt-1">
                    Kolkata, West Bengal, India
                  </p>
                </div>

              </li>

            </ul>

          </div>

        </div>


        {/* ==========================================
            NEWSLETTER
        ========================================== */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/10 px-6 py-8 backdrop-blur-md sm:px-10">

          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

            <div>

              <h3 className="text-xl font-semibold text-white">
                Stay in the style loop
              </h3>

              <p className="mt-2 text-sm text-gray-300">
                Subscribe to receive exclusive offers,
                new arrivals and fashion updates.
              </p>

            </div>


            <div className="flex w-full max-w-md overflow-hidden rounded-xl bg-white p-1 md:w-auto">

              <input
                type="email"
                placeholder="Enter your email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Subscribe
                <ArrowUpRight size={16} />
              </button>

            </div>

          </div>

        </div>


        {/* ==========================================
            BOTTOM FOOTER
        ========================================== */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-7 text-xs text-gray-400 sm:flex-row">

          <p>
            © {new Date().getFullYear()} Forever You.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            <a
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </a>

            <a
              href="/refund-policy"
              className="transition hover:text-white"
            >
              Refund Policy
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;

