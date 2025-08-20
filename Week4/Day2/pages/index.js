import { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import FilterBar from '../components/FilterBar'
import JobCard from '../components/JobCard'
import { jobsData } from '../data/jobsData'
import { useStore } from '../stores/useStore'

export default function Home() {
  const { filters } = useStore()
  const [filteredJobs, setFilteredJobs] = useState(jobsData)
  
  useEffect(() => {
    if (filters.length === 0) {
      setFilteredJobs(jobsData)
    } else {
      const newFilteredJobs = jobsData.filter(job => {
        const jobFilters = [job.role, job.level, ...job.languages, ...job.tools]
        return filters.every(filter => jobFilters.includes(filter))
      })
      setFilteredJobs(newFilteredJobs)
    }
  }, [filters])
  
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-colors duration-200">
      <Head>
        <title>Job Listings with Filtering</title>
        <meta name="description" content="Filter job listings based on your preferences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      <main className="pb-12">
        <FilterBar />
        <div className="container mx-auto px-4 mt-8 md:mt-12">
          <div className="flex flex-col gap-10 md:gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-neutral-700 mb-4 dark:text-neutral-300">No jobs found</h2>
              <p className="text-neutral-500 dark:text-neutral-400">Try adjusting your filters to find more opportunities.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}