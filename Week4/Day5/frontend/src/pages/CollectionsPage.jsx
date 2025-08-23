"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetProductsQuery } from "../redux/apiSlice";
import AddProductModal from "../components/AddProductModal";

const normalize = (str) =>
  str?.toLowerCase().replace(/\s+/g, "").replace(/s$/, "");

const CollectionsPage = () => {
  const { category } = useParams();
  const location = useLocation();

  const [filters, setFilters] = useState({
    collections: [],
    origins: [],
    flavours: [],
    qualities: [],
    cafeines: [],
    allergens: [],
    organic: false,
  });
  const [expandedFilters, setExpandedFilters] = useState({
    collections: false,
    origins: false,
    flavours: false,
    qualities: false,
    cafeines: false,
    allergens: false,
  });
  const [sortBy, setSortBy] = useState("name");
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const { user } = useAuth();
  const userRole = user?.role;

  const { data: productsData, isLoading, refetch } = useGetProductsQuery();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const products = useMemo(() => {
    if (!productsData || !productsData.data) return [];
    return productsData.data.products.map((p) => {
      const mappedCollection = (() => {
        switch (p.category) {
          case "black-tea":
            return "Black teas";
          case "green-tea":
            return "Green teas";
          case "white-tea":
            return "White teas";
          case "herbal-tea":
            return "Herbal teas";
          case "oolong-tea":
            return "Oolong";
          case "chai":
            return "Chai";
          default:
            return p.collection || "";
        }
      })();

      let mappedCaffeine = "";
      switch (p.caffeineLevel) {
        case "none":
          mappedCaffeine = "No Caffeine";
          break;
        case "low":
          mappedCaffeine = "Low Caffeine";
          break;
        case "medium":
          mappedCaffeine = "Medium Caffeine";
          break;
        case "high":
          mappedCaffeine = "High Caffeine";
          break;
        default:
          mappedCaffeine = "";
      }

      return {
        ...p,
        collection: mappedCollection,
        caffeine: mappedCaffeine,
        flavour: p.tags || [],
        qualities: p.tags || [],
        allergens: [],
        organic: mappedCollection.toLowerCase() === "organic",
      };
    });
  }, [productsData]);

  const filterOptions = {
    collections: [
      "Black teas",
      "Green teas",
      "White teas",
      "Chai",
      "Matcha",
      "Herbal teas",
      "Oolong",
      "Rooibos",
      "Teaware",
    ],
    origins: ["India", "Japan", "Iran", "South Africa"],
    flavours: [
      "Spicy",
      "Sweet",
      "Citrus",
      "Smooth",
      "Fruity",
      "Floral",
      "Grassy",
      "Minty",
      "Bitter",
      "Creamy",
    ],
    qualities: ["Detox", "Energy", "Relax", "Digestion"],
    cafeines: [
      "No Caffeine",
      "Low Caffeine",
      "Medium Caffeine",
      "High Caffeine",
    ],
    allergens: ["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"],
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = { ...filters };
    const newExpandedFilters = { ...expandedFilters };

    Object.keys(filterOptions).forEach((filterType) => {
      const paramValue = searchParams.get(filterType);
      if (paramValue) {
        newFilters[filterType] = [paramValue];
        newExpandedFilters[filterType] = true;
      }
    });

    if (searchParams.get("organic") === "true") {
      newFilters.organic = true;
    }

    setFilters(newFilters);
    setExpandedFilters(newExpandedFilters);
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (category) {
      const categoryName = normalize(category.replace("-", " "));
      filtered = filtered.filter(
        (product) => normalize(product.collection) === categoryName
      );
    }

    if (filters.collections.length > 0) {
      filtered = filtered.filter((product) =>
        filters.collections.some(
          (f) => normalize(product.collection) === normalize(f)
        )
      );
    }

    if (filters.origins.length > 0) {
      filtered = filtered.filter((product) =>
        filters.origins.some(
          (o) => normalize(product.origin) === normalize(o)
        )
      );
    }

    if (filters.flavours.length > 0) {
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.flavour) &&
          product.flavour.some((f) =>
            filters.flavours.some((fltr) => normalize(f) === normalize(fltr))
          )
      );
    }

    if (filters.qualities.length > 0) {
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.qualities) &&
          product.qualities.some((q) =>
            filters.qualities.some((fltr) => normalize(q) === normalize(fltr))
          )
      );
    }

    if (filters.cafeines.length > 0) {
      filtered = filtered.filter((product) =>
        filters.cafeines.some(
          (c) => normalize(product.caffeine) === normalize(c)
        )
      );
    }

    if (filters.allergens.length > 0) {
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.allergens) &&
          product.allergens.some((a) =>
            filters.allergens.some(
              (fltr) => normalize(a) === normalize(fltr)
            )
          )
      );
    }

    if (filters.organic) {
      filtered = filtered.filter((product) => product.organic);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, filters, category, sortBy]);

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const toggleExpandedFilter = (filterType) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Image */}
      <div
        className="h-48 sm:h-64 lg:h-[308px] xl:h-[358px] bg-cover bg-center"
        style={{ backgroundImage: `url('/images/BgPic.png')` }}
      ></div>

      {/* Breadcrumb */}
      <div className="py-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm flex flex-wrap items-center">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              HOME
            </Link>
            <span className="mx-2 text-gray-600 dark:text-gray-400">/</span>
            <Link
              to="/collections"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              COLLECTIONS
            </Link>
            {category && (
              <>
                <span className="mx-2 text-gray-600 dark:text-gray-400">/</span>
                <span className="text-gray-800 dark:text-gray-200 uppercase">
                  {category.replace("-", " ")}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="space-y-6">
              {/* Filters */}
              {Object.keys(filterOptions).map((filterType) => (
                <div
                  key={filterType}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4"
                >
                  <button
                    onClick={() => toggleExpandedFilter(filterType)}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white pb-2"
                  >
                    {filterType.toUpperCase()}
                    <span className="text-lg">
                      {expandedFilters[filterType] ? "-" : "+"}
                    </span>
                  </button>
                  {expandedFilters[filterType] && (
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                      {filterOptions[filterType].map((option) => (
                        <label
                          key={option}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters[filterType].includes(option)}
                            onChange={() => toggleFilter(filterType, option)}
                            className="mr-2 rounded border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Organic Toggle */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <span className="font-medium text-gray-900 dark:text-white mr-3">
                    ORGANIC
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.organic}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          organic: e.target.checked,
                        }))
                      }
                      className="sr-only"
                    />
                    <div className="w-8 h-3.5 pt-[1px] border border-gray-800 dark:border-gray-300 rounded-full bg-white dark:bg-gray-700 transition-colors">
                      <div
                        className={`w-2.5 h-2.5 bg-gray-800 dark:bg-gray-300 rounded-full transition-transform ${
                          filters.organic ? "translate-x-4" : "translate-x-1"
                        }`}
                      ></div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort & Add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} products
              </p>
              {(userRole === "admin" || userRole === "superadmin") && (
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Add Product
                </button>
              )}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const imageUrl = product.image
                  ? product.image.startsWith("http")
                    ? product.image
                    : `${API_BASE_URL}/${product.image.replace(/^\//, "")}`
                  : "/images/Blacktea.png";

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          €{product.price?.toFixed(2)} /{" "}
                          {product.weight || "50 g"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No products found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddProductModal && (
        <AddProductModal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          onAdded={refetch}
        />
      )}
    </div>
  );
};

export default CollectionsPage;
