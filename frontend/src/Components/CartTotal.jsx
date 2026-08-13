import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } =
    useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1="CART" text2="TOTALS" />
      </div>

      <div className="mt-6">
        {/* Subtotal */}
        <div className="flex justify-between items-center py-2">
          <p className="text-gray-600">Subtotal</p>
          <p>
            {currency}
            {getCartAmount()}.00
          </p>
        </div>

        <hr />

        {/* Shipping Fee */}
        <div className="flex justify-between items-center py-2">
          <p className="text-gray-600">Shipping Fee</p>
          <p>
            {currency}
            {getCartAmount() === 0 ? 0 : delivery_fee}
          </p>
        </div>

        <hr />

        {/* Total */}
        <div className="flex justify-between items-center py-2">
          <b>Total</b>
          <b>
            {currency}
            {getCartAmount() === 0
              ? 0
              : getCartAmount() + delivery_fee}
            .00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;