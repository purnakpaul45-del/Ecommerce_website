import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { products } from "../assets/assets";

import { toast } from "react-toastify";

export const ShopContext = createContext();


// =====================================================
// AUTH HOOK
// =====================================================

export const useAuth = () => {
  return useContext(ShopContext);
};


const ShopContextProvider = (props) => {

  // =====================================================
  // BACKEND
  // =====================================================

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  // =====================================================
  // STORE SETTINGS
  // =====================================================

  const currency = "₹";

  const delivery_fee = 9;


  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate();


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [token, setToken] = useState(() => {

    const savedToken = localStorage.getItem("token");

    console.log(
      "Token loaded from localStorage:",
      savedToken
    );

    return savedToken || "";
  });


  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  const login = (admin, newToken) => {

    // Save token
    setToken(newToken);

    // Save admin information
    if (admin) {

      localStorage.setItem(
        "admin",
        JSON.stringify(admin)
      );
    }

    console.log("Admin login successful");
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    setToken("");

    localStorage.removeItem("token");

    localStorage.removeItem("admin");

    console.log("User logged out");

    navigate("/login");
  };


  // =====================================================
  // SAVE TOKEN TO LOCALSTORAGE
  // =====================================================

  useEffect(() => {

    console.log(
      "Token changed:",
      token
    );

    if (token) {

      localStorage.setItem(
        "token",
        token
      );

      console.log(
        "User token saved to localStorage"
      );

    } else {

      localStorage.removeItem(
        "token"
      );

      console.log(
        "User token removed from localStorage"
      );
    }

  }, [token]);


  // =====================================================
  // SEARCH STATES
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [showSearch, setShowSearch] =
    useState(false);


  // =====================================================
  // CART STATE
  // =====================================================

  const [cartItems, setCartItems] =
    useState({});


  // =====================================================
  // ADD PRODUCT TO CART
  // =====================================================

  const addToCart = async (
    itemId,
    size
  ) => {

    if (!size) {

      toast.error(
        "Please select product size"
      );

      return;
    }

    const cartData =
      structuredClone(cartItems);


    if (cartData[itemId]) {

      if (
        cartData[itemId][size]
      ) {

        cartData[itemId][size] += 1;

      } else {

        cartData[itemId][size] = 1;
      }

    } else {

      cartData[itemId] = {};

      cartData[itemId][size] = 1;
    }


    setCartItems(cartData);


    toast.success(
      "Product added to cart"
    );
  };


  // =====================================================
  // GET TOTAL CART COUNT
  // =====================================================

  const getCartCount = () => {

    let totalCount = 0;


    for (
      const itemId in cartItems
    ) {

      for (
        const size in cartItems[itemId]
      ) {

        const quantity =
          cartItems[itemId][size];


        if (quantity > 0) {

          totalCount += quantity;
        }
      }
    }


    return totalCount;
  };


  // =====================================================
  // UPDATE CART QUANTITY
  // =====================================================

  const updateQuantity = async (
    itemId,
    size,
    quantity
  ) => {

    const cartData =
      structuredClone(cartItems);


    if (quantity <= 0) {

      if (
        cartData[itemId] &&
        cartData[itemId][size]
      ) {

        delete cartData[itemId][size];
      }


      if (
        cartData[itemId] &&
        Object.keys(
          cartData[itemId]
        ).length === 0
      ) {

        delete cartData[itemId];
      }

    } else {

      if (!cartData[itemId]) {

        cartData[itemId] = {};
      }


      cartData[itemId][size] =
        quantity;
    }


    setCartItems(cartData);
  };


  // =====================================================
  // GET TOTAL CART AMOUNT
  // =====================================================

  const getCartAmount = () => {

    let totalAmount = 0;


    for (
      const itemId in cartItems
    ) {

      const itemInfo =
        products.find(
          (product) =>
            product._id === itemId ||
            product.id === itemId
        );


      if (!itemInfo) {

        continue;
      }


      for (
        const size in cartItems[itemId]
      ) {

        const quantity =
          cartItems[itemId][size];


        if (quantity > 0) {

          totalAmount +=
            itemInfo.price *
            quantity;
        }
      }
    }


    return totalAmount;
  };


  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = () => {

    setCartItems({});

    toast.success(
      "Cart cleared successfully"
    );
  };


  // =====================================================
  // DEBUG CART
  // =====================================================

  useEffect(() => {

    console.log(
      "Current Cart:",
      cartItems
    );

  }, [cartItems]);


  // =====================================================
  // DEBUG AUTH TOKEN
  // =====================================================

  useEffect(() => {

    console.log(
      "Current Auth Token:",
      token
    );

    console.log(
      "Stored Token:",
      localStorage.getItem(
        "token"
      )
    );

  }, [token]);


  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {

    // Products
    products,


    // Backend
    backendUrl,


    // Store
    currency,
    delivery_fee,


    // Authentication
    token,
    setToken,
    login,
    logout,


    // Search
    search,
    setSearch,

    showSearch,
    setShowSearch,


    // Cart
    cartItems,
    setCartItems,

    addToCart,

    getCartCount,

    updateQuantity,

    getCartAmount,

    clearCart,


    // Navigation
    navigate,
  };


  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <ShopContext.Provider
      value={value}
    >
      {props.children}
    </ShopContext.Provider>
  );
};


export default ShopContextProvider;