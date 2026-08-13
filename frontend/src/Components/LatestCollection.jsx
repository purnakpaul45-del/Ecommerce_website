
import React, { useContext, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { assets } from "../assets/assets";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <section className="relative overflow-hidden py-20">

      {/* ==========================================
          BACKGROUND IMAGE
      ========================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${assets.collectionBg})`,
        }}
      />

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-white/90" />

      {/* Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white" />


      {/* ==========================================
          CONTENT
      ========================================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


        {/* ==========================================
            SECTION HEADER
        ========================================== */}
        <div className="mx-auto mb-14 max-w-3xl text-center">

          {/* Small Label */}
          <div className="mb-5 flex items-center justify-center gap-4">

            <span className="h-px w-12 bg-gray-400"></span>

            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
              New Season
            </span>

            <span className="h-px w-12 bg-gray-400"></span>

          </div>


          {/* Title */}
          <div className="text-3xl sm:text-4xl lg:text-5xl">
            <Title
              text1="LATEST"
              text2="COLLECTION"
            />
          </div>


          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Discover our newest arrivals, thoughtfully designed for
            effortless style. Explore timeless silhouettes, modern
            essentials, and statement pieces made for every occasion.
          </p>

        </div>


        {/* ==========================================
            PRODUCTS
        ========================================== */}
        <div className="mx-auto max-w-7xl">

          {latestProducts.length > 0 ? (

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6">

              {latestProducts.map((item, index) => (

                <div
                  key={item._id || index}
                  className="group rounded-xl transition-all duration-500 hover:-translate-y-2"
                >

                  <ProductItem
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                  />

                </div>

              ))}

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

              {[...Array(10)].map((_, index) => (

                <div
                  key={index}
                  className="animate-pulse"
                >

                  <div className="aspect-[3/4] rounded-xl bg-gray-200"></div>

                  <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>

                  <div className="mt-2 h-4 w-1/3 rounded bg-gray-200"></div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ==========================================
            VIEW ALL BUTTON
        ========================================== */}
        <div className="mt-16 flex justify-center">

          <a
            href="/collection"
            className="group flex items-center gap-3 rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-xl"
          >

            Explore Full Collection

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />

          </a>

        </div>

      </div>

    </section>
  );
};

export default LatestCollection;

