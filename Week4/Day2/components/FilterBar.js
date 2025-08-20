"use client"

import { X, Filter } from "lucide-react"
import { useStore } from "../stores/useStore"

const FilterBar = () => {
  const { filters, removeFilter, clearFilters } = useStore()

  if (filters.length === 0) return null

  return (
    <div className="container mx-auto px-4 -mt-8 mb-10 relative z-20">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <Filter size={18} />
          <span className="font-medium text-sm">Active Filters:</span>
        </div>
        <div className="flex flex-wrap gap-2 flex-1">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex overflow-hidden rounded-lg shadow-sm transform hover:scale-105 transition-all duration-200"
            >
              <span className="bg-primary-100 text-primary-700 font-medium px-3 py-2 text-sm dark:bg-neutral-700 dark:text-neutral-200">
                {filter}
              </span>
              <button
                onClick={() => removeFilter(filter)}
                className="bg-primary-500 text-white px-2 hover:bg-primary-600 transition-colors duration-200 dark:bg-primary-600 dark:hover:bg-primary-700 group"
                aria-label={`Remove ${filter} filter`}
              >
                <X size={16} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={clearFilters}
          className="text-primary-500 font-medium hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 text-sm px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-neutral-700"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

export default FilterBar
