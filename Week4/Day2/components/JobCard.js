"use client"

import { useStore } from "../stores/useStore"
import { useRouter } from "next/router"
import { MapPin, Clock, DollarSign, ChevronRight } from "lucide-react"

const JobCard = ({ job }) => {
  const { filters, addFilter } = useStore()
  const router = useRouter()

  const allFilters = [job.role, job.level, ...job.languages, ...job.tools]

  const handleFilterClick = (filter, e) => {
    e.stopPropagation()
    addFilter(filter)
  }

  const handleCardClick = () => {
    router.push(`/jobs/${job.id}`)
  }

  return (
    <div
      className={`job-card group ${job.featured ? "border-l-4 border-primary-500" : ""} cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg p-6 border border-neutral-200 dark:border-neutral-700`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex items-start lg:items-center gap-4 lg:gap-6 flex-1">
          <div className="relative">
            <img
              src={job.logo || "/placeholder.svg"}
              alt={job.company}
              className="w-12 h-12 lg:w-16 lg:h-16 -mt-12 lg:mt-0 rounded-full border-2 border-neutral-200 dark:border-neutral-600 group-hover:border-primary-300 transition-colors duration-300"
            />
            {job.featured && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-primary-500 font-bold text-lg group-hover:text-primary-600 transition-colors duration-200">
                {job.company}
              </h3>
              {job.new && (
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase animate-pulse">
                  New!
                </span>
              )}
              {job.featured && (
                <span className="bg-gradient-to-r from-neutral-800 to-neutral-700 text-white text-xs font-bold px-2 py-1 rounded-full uppercase dark:from-neutral-700 dark:to-neutral-600">
                  Featured
                </span>
              )}
            </div>
            <h2 className="font-bold text-xl mb-3 text-neutral-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
              {job.position}
            </h2>
            <div className="flex items-center gap-4 text-neutral-500 text-sm mb-4 dark:text-neutral-400 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{job.postedAt}</span>
              </div>
              <span className="w-1 h-1 bg-neutral-300 rounded-full hidden sm:block"></span>
              <div className="flex items-center gap-1">
                <span className="font-medium">{job.contract}</span>
              </div>
              <span className="w-1 h-1 bg-neutral-300 rounded-full hidden sm:block"></span>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <>
                  <span className="w-1 h-1 bg-neutral-300 rounded-full hidden sm:block"></span>
                  <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
                    <DollarSign size={14} />
                    <span>{job.salary}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="flex flex-wrap gap-2 lg:justify-end border-t pt-4 lg:border-t-0 lg:pt-0"
            onClick={(e) => e.stopPropagation()}
          >
            {allFilters.slice(0, 4).map((filter, index) => (
              <button
                key={index}
                onClick={(e) => handleFilterClick(filter, e)}
                className={`filter-pill text-sm px-3 py-1 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                  filters.includes(filter)
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
                }`}
              >
                {filter}
              </button>
            ))}
            {allFilters.length > 4 && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 px-2 py-1">
                +{allFilters.length - 4} more
              </span>
            )}
          </div>
          <div className="flex items-center justify-end text-primary-500 dark:text-primary-400 text-sm font-medium group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-200">
            <span className="hidden lg:inline">View Details</span>
            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCard
