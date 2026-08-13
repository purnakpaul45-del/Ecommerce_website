import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { FaStar } from "react-icons/fa";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, addToCart } = useContext(ShopContext);

  // Original price and discount
  const originalPrice = Math.round(price * 1.25);

  const discount = Math.round(
    ((originalPrice - price) / originalPrice) * 100
  );

  return (
    <div className="group w-full min-w-0">
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}
      <Link to={`/product/${id}`}>
        <div className="w-full overflow-hidden rounded-xl bg-gray-100">
          <img
            src={image?.[0]}
            alt={name}
            className="
              block
              h-64
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </div>
      </Link>

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}
      <div className="pt-3">
        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3
            className="
              h-10
              overflow-hidden
              text-sm
              leading-5
              text-gray-700
              transition
              hover:text-black
            "
          >
            {name}
          </h3>
        </Link>

        {/* ===================================================
            RATING
        =================================================== */}
        <div className="mt-2 flex items-center">
          <div className="flex gap-[2px] text-sm text-yellow-400">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar className="text-gray-300" />
          </div>

          <span className="ml-2 text-xs text-gray-500">
            4.5
          </span>
        </div>

        {/* ===================================================
            PRICE
        =================================================== */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold text-black">
            {currency}
            {price}
          </span>

          <span className="text-sm text-gray-400 line-through">
            {currency}
            {originalPrice}
          </span>
        </div>

        {/* ===================================================
            DISCOUNT - BOTTOM ONLY
        =================================================== */}
        <div className="mt-2">
          <span className="text-sm font-medium text-orange-500">
            {discount}% OFF
          </span>
        </div>

        {/* ===================================================
            ADD TO CART
        =================================================== */}
        <button
          type="button"
          onClick={() => addToCart(id)}
          className="
            mt-4
            w-full
            rounded-lg
            bg-black
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-gray-800
            active:scale-[0.98]
          "
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;