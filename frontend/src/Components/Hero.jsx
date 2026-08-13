
import React from "react";
import { ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950">

      {/* ==========================================
          HERO IMAGE
      ========================================== */}
      <div className="relative min-h-[650px] w-full sm:min-h-[700px] lg:min-h-[780px]">

        <img
          src={assets.hero_img}
          alt="Latest fashion collection"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* ========================================
            DARK GRADIENT OVERLAY
        ======================================== */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />

        {/* ==========================================
            HERO CONTENT
        ========================================== */}
        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-6 sm:min-h-[700px] sm:px-10 lg:min-h-[780px] lg:px-16">

          <div className="max-w-2xl text-white">

            {/* New Collection Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">

              <Sparkles
                size={15}
                className="text-yellow-300"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                New Season 2026
              </span>

            </div>

            {/* Small Heading */}
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/70 sm:text-base">
              Discover your style
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              Elevate Your
              <br />
              Everyday Style.
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Explore our latest collection of premium fashion,
              thoughtfully designed for modern lifestyles.
              Discover timeless essentials and standout pieces
              made to define your style.
            </p>

            {/* ========================================
                CTA BUTTONS
            ======================================== */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              {/* Primary CTA */}
              <button
                type="button"
                className="group flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-900 transition-all duration-300 hover:bg-slate-100 hover:shadow-xl"
              >
                Shop Collection

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                className="rounded-full border border-white/40 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-slate-900"
              >
                Explore Bestseller
              </button>

            </div>

            {/* ========================================
                TRUST FEATURES
            ======================================== */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/20 pt-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                  <Truck size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Free Shipping
                  </p>

                  <p className="text-[11px] text-white/60">
                    On orders above ₹999
                  </p>
                </div>

              </div>

              <div className="hidden h-8 w-px bg-white/20 sm:block" />

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Secure Payments
                  </p>

                  <p className="text-[11px] text-white/60">
                    100% secure checkout
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            SCROLL INDICATOR
        ========================================== */}
        <div className="absolute bottom-8 right-8 z-20 hidden flex-col items-center gap-3 text-white/60 lg:flex">

          <span className="text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>

          <div className="h-12 w-px bg-white/40" />

        </div>

      </div>

    </section>
  );
};

export default Hero;

