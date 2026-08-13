import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { ShopContext } from "../Context/ShopContext";
import Title from "../Components/Title";
import ProductItem from "../Components/ProductItem";

const Collection = () => {
  // =====================================================
  // SHOP CONTEXT
  // =====================================================

  const {
    products,
    search,
    showSearch,
  } = useContext(ShopContext);

  // =====================================================
  // FILTER STATES
  // =====================================================

  const [showFilter, setShowFilter] =
    useState(false);

  const [filterProducts, setFilterProducts] =
    useState([]);

  const [category, setCategory] =
    useState([]);

  const [subcategory, setSubCategory] =
    useState([]);

  const [sortType, setSortType] =
    useState("relavent");

  // =====================================================
  // CATEGORY FILTER
  // =====================================================

  const toggleCategory = (event) => {
    const value = event.target.value;

    if (category.includes(value)) {
      setCategory((prev) =>
        prev.filter(
          (item) => item !== value
        )
      );
    } else {
      setCategory((prev) => [
        ...prev,
        value,
      ]);
    }
  };

  // =====================================================
  // SUBCATEGORY FILTER
  // =====================================================

  const toggleSubCategory = (event) => {
    const value = event.target.value;

    if (subcategory.includes(value)) {
      setSubCategory((prev) =>
        prev.filter(
          (item) => item !== value
        )
      );
    } else {
      setSubCategory((prev) => [
        ...prev,
        value,
      ]);
    }
  };

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  useEffect(() => {
    let productsCopy = products.slice();

    // -------------------------------------------------
    // SEARCH FILTER
    // -------------------------------------------------

    if (
      showSearch &&
      search.trim()
    ) {
      productsCopy =
        productsCopy.filter(
          (item) =>
            item.name
              ?.toLowerCase()
              .includes(
                search
                  .trim()
                  .toLowerCase()
              )
        );
    }

    // -------------------------------------------------
    // CATEGORY FILTER
    // -------------------------------------------------

    if (category.length > 0) {
      productsCopy =
        productsCopy.filter(
          (item) =>
            category.includes(
              item.category
            )
        );
    }

    // -------------------------------------------------
    // SUBCATEGORY FILTER
    // -------------------------------------------------

    if (
      subcategory.length > 0
    ) {
      productsCopy =
        productsCopy.filter(
          (item) =>
            subcategory.includes(
              item.subCategory
            )
        );
    }

    // -------------------------------------------------
    // SORT PRODUCTS
    // -------------------------------------------------

    switch (sortType) {
      case "low-high":
        productsCopy.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
        break;

      case "high-low":
        productsCopy.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
        break;

      default:
        // Keep original order
        break;
    }

    setFilterProducts(
      productsCopy
    );
  }, [
    products,
    search,
    showSearch,
    category,
    subcategory,
    sortType,
  ]);

  // =====================================================
  // CLEAR ALL FILTERS
  // =====================================================

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relavent");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">

      {/* =================================================
          MAIN COLLECTION CONTAINER
      ================================================= */}

      <div className="flex flex-col gap-6 sm:flex-row">

        {/* =================================================
            LEFT FILTER SIDEBAR
        ================================================= */}

        <aside className="w-full shrink-0 sm:w-48 lg:w-56">

          {/* Mobile Filter Button */}

          <button
            type="button"
            onClick={() =>
              setShowFilter(
                (prev) => !prev
              )
            }
            className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium sm:hidden"
          >
            <span>
              FILTERS
            </span>

            <span>
              {showFilter
                ? "−"
                : "+"}
            </span>
          </button>

          {/* =================================================
              FILTER CONTENT
          ================================================= */}

          <div
            className={`space-y-5 ${
              showFilter
                ? "block"
                : "hidden"
            } sm:block`}
          >

            {/* =================================================
                CATEGORY
            ================================================= */}

            <div className="border border-gray-300 p-5">

              <p className="mb-4 text-sm font-semibold text-gray-800">
                CATEGORIES
              </p>

              <div className="flex flex-col gap-3 text-sm text-gray-600">

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    value="Men"
                    checked={category.includes(
                      "Men"
                    )}
                    onChange={
                      toggleCategory
                    }
                    className="h-3.5 w-3.5"
                  />

                  <span>
                    Men
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    value="Women"
                    checked={category.includes(
                      "Women"
                    )}
                    onChange={
                      toggleCategory
                    }
                    className="h-3.5 w-3.5"
                  />

                  <span>
                    Women
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    value="Kids"
                    checked={category.includes(
                      "Kids"
                    )}
                    onChange={
                      toggleCategory
                    }
                    className="h-3.5 w-3.5"
                  />

                  <span>
                    Kids
                  </span>
                </label>

              </div>
            </div>

            {/* =================================================
                SUBCATEGORY
            ================================================= */}

            <div className="border border-gray-300 p-5">

              <p className="mb-4 text-sm font-semibold text-gray-800">
                TYPE
              </p>

              <div className="flex flex-col gap-3 text-sm text-gray-600">

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    value="Topwear"
                    checked={subcategory.includes(
                      "Topwear"
                    )}
                    onChange={
                      toggleSubCategory
                    }
                    className="h-3.5 w-3.5"
                  />

                  <span>
                    Topwear
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    value="Bottomwear"
                    checked={subcategory.includes(
                      "Bottomwear"
                    )}
                    onChange={
                      toggleSubCategory
                    }
                    className="h-3.5 w-3.5"
                  />

                  <span>
                    Bottomwear
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    value="Winterwear"
                    checked={subcategory.includes(
                      "Winterwear"
                    )}
                    onChange={
                      toggleSubCategory
                    }
                    className="h-3.5 w-3.5"
                  />

                  <span>
                    Winterwear
                  </span>
                </label>

              </div>
            </div>

            {/* =================================================
                CLEAR FILTERS
            ================================================= */}

            {(category.length > 0 ||
              subcategory.length >
                0 ||
              sortType !==
                "relavent") && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Clear Filters
              </button>
            )}

          </div>
        </aside>

        {/* =================================================
            RIGHT PRODUCT SECTION
        ================================================= */}

        <main className="min-w-0 flex-1">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <Title
              text1="ALL"
              text2="COLLECTIONS"
            />

            {/* =================================================
                SORT
            ================================================= */}

            <select
              value={sortType}
              onChange={(event) =>
                setSortType(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black sm:w-auto"
            >
              <option value="relavent">
                Sort by: Relevant
              </option>

              <option value="low-high">
                Sort by: Low to High
              </option>

              <option value="high-low">
                Sort by: High to Low
              </option>
            </select>
          </div>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

            {filterProducts.length >
            0 ? (
              filterProducts.map(
                (item) => (
                  <ProductItem
                    key={
                      item._id ||
                      item.id
                    }
                    id={
                      item._id ||
                      item.id
                    }
                    image={
                      item.image
                    }
                    name={
                      item.name
                    }
                    price={
                      item.price
                    }
                  />
                )
              )
            ) : (
              /* =================================================
                 NO PRODUCTS
              ================================================= */

              <div className="col-span-full py-16 text-center">

                <p className="text-lg font-medium text-gray-700">
                  No products found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your
                  filters or search.
                </p>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Collection;