import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import Header from '../../../components/Header'
import { jobsData } from '../../../data/jobsData'
import { ArrowLeft, CheckCircle, Upload, FileText } from 'lucide-react'

const JobApplication = () => {
  const router = useRouter()
  const { id } = router.query
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const job = jobsData.find(j => j.id === parseInt(id))
  
  if (!job) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-neutral-700 dark:text-neutral-300">Job not found</h1>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>
        </div>
      </div>
    )
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
        <Head>
          <title>Application Submitted | Job Listings</title>
        </Head>
        
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/20">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Application Submitted!</h1>
            <p className="text-neutral-600 mb-8 dark:text-neutral-300">
              Thank you for applying to the {job.position} position at {job.company}. 
              We've received your application and will review it carefully.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/')}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Browse More Jobs
              </button>
              <button 
                onClick={() => router.push(`/jobs/${job.id}`)}
                className="bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 font-medium py-2 px-6 rounded-md transition-colors dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white dark:border-neutral-600"
              >
                Back to Job Details
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <Head>
        <title>Apply for {job.position} | Job Listings</title>
      </Head>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <button 
          onClick={() => router.push(`/jobs/${job.id}`)}
          className="mb-6 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Job
        </button>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-neutral-800">
            <h1 className="text-2xl font-bold mb-2 dark:text-white">Apply for {job.position}</h1>
            <p className="text-neutral-600 dark:text-neutral-400">at {job.company}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-neutral-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-neutral-300">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-neutral-300">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-neutral-300">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-neutral-300">Cover Letter</label>
                <textarea 
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  placeholder="Why are you interested in this position? What makes you a good fit?"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-neutral-300">Resume *</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors dark:border-neutral-600 dark:hover:border-neutral-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload size={24} className="text-neutral-400 mb-2" />
                      <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        PDF, DOC, DOCX (MAX. 5MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </label>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    By applying to this position, you agree to our Privacy Policy and consent to 
                    having your data stored and processed for recruitment purposes.
                  </p>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

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
  
  const handleApplyClick = (e) => {
    e.stopPropagation()
    router.push(`/jobs/apply/${job.id}`)
  }
  
  return (
    <div 
      className={`job-card ${job.featured ? 'border-l-4 border-primary-500' : ''} cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* ... (job card content remains the same) */}
        
        <div 
          className="flex flex-wrap gap-3 md:ml-auto md:justify-end border-t pt-4 md:border-t-0 md:pt-0"
          onClick={(e) => e.stopPropagation()}
        >
          {allFilters.map((filter, index) => (
            <button
              key={index}
              onClick={(e) => handleFilterClick(filter, e)}
              className={`filter-pill ${filters.includes(filter) ? 'active-filter' : ''}`}
            >
              {filter}
            </button>
          ))}
          
          {/* Add direct apply button */}
          <button
            onClick={handleApplyClick}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-1 rounded-md transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobCard

export default JobApplication