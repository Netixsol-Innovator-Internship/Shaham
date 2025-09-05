"use client";
import { FC } from "react";

interface FiltersProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const categories = ["t-shirts", "shorts", "shirts", "hoodie", "jeans"];
const styles = ["casual", "formal", "party", "gym"];

// From Variant schema
const colors = [
  "green", "red", "yellow", "orange", "lightblue",
  "navy", "purple", "pink", "black", "white"
];

// From SizeStock schema
const sizes = [
  "xx-small", "x-small", "small", "medium",
  "large", "x-large", "xx-large",
  "3x-large", "4x-large",
];

const defaultFilters = {
  category: [],
  style: [],
  colors: [],
  size: "",
  price: [0, 10000],
};

const Filters: FC<FiltersProps> = ({ filters, setFilters }) => {
  const toggleFilter = (key: string, value: string) => {
    setFilters((prev: any) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v: string) => v !== value)
          : [...current, value],
      };
    });
  };

  const setSingleFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value, // toggle off if same size clicked again
    }));
  };

  const setPriceRange = (min: number, max: number) => {
    setFilters((prev: any) => ({ ...prev, price: [min, max] }));
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="w-64 bg-white rounded-2xl shadow p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div>
        <p className="font-medium mb-2">Category</p>
        {categories.map((cat) => (
          <label key={cat} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={filters.category.includes(cat)}
              onChange={() => toggleFilter("category", cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Styles */}
      <div>
        <p className="font-medium mb-2">Style</p>
        {styles.map((s) => (
          <label key={s} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={filters.style.includes(s)}
              onChange={() => toggleFilter("style", s)}
            />
            {s}
          </label>
        ))}
      </div>

      {/* Colors */}
      <div>
        <p className="font-medium mb-2">Colors</p>
        <div className="flex gap-2 flex-wrap">
          {colors.map((c) => (
            <button
              key={c}
              aria-label={`color-${c}`}
              onClick={() => toggleFilter("colors", c)}
              className={`w-6 h-6 rounded-full border-2 ${
                filters.colors.includes(c)
                  ? "border-black"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Sizes (radio, Wattpad-tag style) */}
      <div>
        <p className="font-medium mb-2">Sizes</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSingleFilter("size", size)}
              className={`px-3 py-1 rounded-full text-sm border ${
                filters.size === size
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="font-medium mb-2">Price</p>
        <input
          type="range"
          min={50}
          max={200}
          value={filters.price[0]}
          onChange={(e) =>
            setPriceRange(Number(e.target.value), filters.price[1])
          }
          className="w-full"
        />
        <input
          type="range"
          min={50}
          max={200}
          value={filters.price[1]}
          onChange={(e) =>
            setPriceRange(filters.price[0], Number(e.target.value))
          }
          className="w-full"
        />
        <div className="text-sm mt-1">
          ${filters.price[0]} - ${filters.price[1]}
        </div>
      </div>
    </div>
  );
};

export default Filters;
