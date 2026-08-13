import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";

const Product = () => {
  const { productId } = useParams();

  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const product = products.find((item) => item._id === productId);

    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  if (!productData) return null;

  const originalPrice = Math.round(productData.price * 1.25);
  const discount = Math.round(
    ((originalPrice - productData.price) / originalPrice) * 100
  );

  return (
    <div className="border-t pt-10 px-4 sm:px-8 lg:px-12">

      <div className="flex flex-col lg:flex-row items-start gap-12">

        {/* LEFT SECTION */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row items-start gap-4">

          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 sm:w-24 overflow-x-auto">

            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                alt=""
                onClick={() => setImage(item)}
                className={`w-20 h-24 object-cover rounded-lg cursor-pointer border transition ${
                  image === item
                    ? "border-black"
                    : "border-gray-300"
                }`}
              />
            ))}

          </div>

          {/* Main Image */}
          <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center p-6">

            <img
              src={image}
              alt={productData.name}
              className="w-full max-w-md object-contain hover:scale-105 transition duration-300"
            />

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="flex-1">

          <h1 className="text-3xl font-semibold leading-tight">
            {productData.name}
          </h1>

          {/* Rating */}

          <div className="flex items-center gap-2 mt-3">

            <div className="flex">
              <img src={assets.star_icon} className="w-4" alt="" />
              <img src={assets.star_icon} className="w-4" alt="" />
              <img src={assets.star_icon} className="w-4" alt="" />
              <img src={assets.star_icon} className="w-4" alt="" />
              <img src={assets.star_dull_icon} className="w-4" alt="" />
            </div>

            <span className="text-gray-500">
              (122 Reviews)
            </span>

          </div>

          {/* Price */}

          <div className="flex items-center gap-4 mt-6">

            <span className="text-4xl font-bold text-black">
              {currency}
              {productData.price}
            </span>

            <span className="text-2xl text-gray-400 line-through">
              {currency}
              {originalPrice}
            </span>

            <span className="text-green-600 text-xl font-semibold">
              {discount}% OFF
            </span>

          </div>

          {/* Offer */}

          <div className="mt-4 inline-flex items-center rounded-full bg-green-100 px-5 py-2">

            <span className="text-green-700 font-medium">
              🎉 Extra 10% OFF on prepaid orders
            </span>

          </div>

          {/* Description */}

          <p className="mt-6 text-gray-600 leading-7">
            {productData.description}
          </p>

          {/* Size */}

          <div className="mt-8">

            <h3 className="font-semibold mb-4">
              Select Size
            </h3>

            <div className="flex gap-3 flex-wrap">

              {productData.sizes?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`px-5 py-2 rounded-lg border transition ${
                    size === item
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 border-gray-300 hover:border-black"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

          {/* Add To Cart */}

          <button
            onClick={() => addToCart(productData._id, size)}
            className="mt-8 bg-black text-white px-10 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Add to Cart
          </button>

          <hr className="my-8" />

          {/* Information */}

          <div className="space-y-3 text-sm text-gray-600">

            <p>✓ 100% Original Product</p>

            <p>✓ Cash on Delivery Available</p>

            <p>✓ Easy 7 Days Return & Exchange</p>

            <p>✓ Free Shipping on orders above ₹999</p>

            <p>✓ Secure Payments</p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Product;