import React from "react";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      description:
        "Your information and payments are protected with secure checkout.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "We make sure your orders are delivered safely and on time.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description:
        "Our goal is to provide a smooth and helpful shopping experience.",
    },
    {
      icon: Sparkles,
      title: "Quality Products",
      description:
        "Explore carefully selected products for men, women and kids.",
    },
  ];

  return (
    <div className="bg-white text-slate-800">

      {/* ================= HERO ================= */}

      <section className="bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
                <ShoppingBag size={16} />
                About Our Store
              </div>

              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Fashion made
                <span className="text-indigo-600">
                  {" "}simple.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                We are an online fashion store offering stylish,
                comfortable and affordable products for men, women
                and kids.
              </p>

              <Link
                to="/collection"
                className="mt-8 inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Start Shopping
              </Link>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-10 shadow-xl">
              <ShoppingBag
                size={70}
                className="text-white"
              />

              <h2 className="mt-8 text-3xl font-bold text-white">
                Your style.
                <br />
                Your choice.
              </h2>

              <p className="mt-4 text-sm leading-6 text-indigo-100">
                Discover products that fit your lifestyle and
                make everyday shopping easier.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ================= OUR STORY ================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-10 lg:grid-cols-2">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Our Story
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              More than just an online store
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-7 text-slate-600">

            <p>
              Our ecommerce platform was created with a simple idea:
              make online shopping easy, modern and enjoyable.
            </p>

            <p>
              Customers can explore a wide range of products from
              the comfort of their homes and place orders through
              a simple and convenient shopping experience.
            </p>

            <p>
              We focus on product quality, secure payments,
              reliable delivery and customer satisfaction.
            </p>

          </div>

        </div>

      </section>


      {/* ================= WHY CHOOSE US ================= */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              A better way to shop
            </h2>

            <p className="mt-4 text-sm text-slate-500">
              Everything we do is focused on giving you a better
              shopping experience.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* ================= CATEGORIES ================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Our Collections
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Something for everyone
          </h2>

        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <Link
            to="/mens"
            className="rounded-3xl bg-slate-900 p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-3xl font-bold text-white">
              Men
            </h3>

            <p className="mt-3 text-sm text-slate-400">
              Discover modern styles and everyday essentials.
            </p>

            <p className="mt-8 text-sm font-semibold text-white">
              Explore →
            </p>
          </Link>


          <Link
            to="/womens"
            className="rounded-3xl bg-indigo-600 p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-3xl font-bold text-white">
              Women
            </h3>

            <p className="mt-3 text-sm text-indigo-100">
              Find stylish pieces for every occasion.
            </p>

            <p className="mt-8 text-sm font-semibold text-white">
              Explore →
            </p>
          </Link>


          <Link
            to="/kids"
            className="rounded-3xl bg-violet-600 p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-3xl font-bold text-white">
              Kids
            </h3>

            <p className="mt-3 text-sm text-violet-100">
              Comfortable and playful styles for kids.
            </p>

            <p className="mt-8 text-sm font-semibold text-white">
              Explore →
            </p>
          </Link>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="px-6 pb-20">

        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-14 text-center">

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to find your next favorite product?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-indigo-100">
            Explore our latest collections and discover products
            made for you.
          </p>

          <Link
            to="/collection"
            className="mt-7 inline-block rounded-xl bg-white px-7 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Shop Now
          </Link>

        </div>

      </section>

    </div>
  );
};

export default About;