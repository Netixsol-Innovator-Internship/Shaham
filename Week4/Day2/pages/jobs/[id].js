"use client"

import { useRouter } from "next/router"
import { useState } from "react"
import Head from "next/head"
import Header from "../../components/Header"
import { jobsData } from "../../data/jobsData"
import {
  MapPin,
  Clock,
  Calendar,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  DollarSign,
  Users,
  Building,
  X,
  Upload,
  Send,
  Search,
} from "lucide-react"

const JobDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const job = jobsData.find((j) => j.id === Number.parseInt(id))

  if (!job) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                <Search size={32} className="text-neutral-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-neutral-700 dark:text-neutral-300 mb-4">Job Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
            >
              <ArrowLeft size={16} />
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleApply = () => {
    setShowApplyForm(true)
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowApplyForm(false)
    alert("Application submitted successfully!")
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      resume: null,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-200">
      <Head>
        <title>
          {job.position} at {job.company} | Job Board
        </title>
        <meta name="description" content={job.description} />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/")}
          className="mb-8 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 border border-neutral-200 dark:border-neutral-700"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-top duration-500">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  src={job.logo || "/placeholder.svg"}
                  alt={job.company}
                  className="w-20 h-20 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 shadow-md"
                />
                {job.featured && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white leading-tight">{job.position}</h1>
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Building size={18} className="text-primary-500" />
                    <span className="text-primary-500 font-semibold text-lg">{job.company}</span>
                  </div>
                  {job.new && (
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase animate-pulse shadow-md">
                      New!
                    </span>
                  )}
                  {job.featured && (
                    <span className="bg-gradient-to-r from-neutral-800 to-neutral-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase dark:from-neutral-700 dark:to-neutral-600 shadow-md">
                      Featured
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary-500" />
                    <span className="font-medium">{job.postedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary-500" />
                    <span className="font-medium">{job.contract}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary-500" />
                    <span className="font-medium">{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-primary-500" />
                      <span className="font-medium text-primary-600 dark:text-primary-400">{job.salary}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:ml-auto">
              <button
                onClick={handleApply}
                className="w-full lg:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Apply Now <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-left duration-500">
              <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
                <div className="w-1 h-8 bg-primary-500 rounded-full"></div>
                Job Description
              </h2>
              <p className="text-neutral-700 mb-8 dark:text-neutral-300 leading-relaxed text-lg">{job.description}</p>

              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold mb-4 text-xl dark:text-white flex items-center gap-2">
                    <CheckCircle size={20} className="text-primary-500" />
                    Requirements
                  </h3>
                  <ul className="space-y-3">
                    {job.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300 leading-relaxed"
                      >
                        <CheckCircle size={16} className="text-primary-500 mt-1 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h3 className="font-bold mb-4 text-xl dark:text-white flex items-center gap-2">
                    <Users size={20} className="text-primary-500" />
                    Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300 leading-relaxed"
                      >
                        <CheckCircle size={16} className="text-primary-500 mt-1 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-left duration-700">
              <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
                <div className="w-1 h-8 bg-primary-500 rounded-full"></div>
                About {job.company}
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg">
                {job.company} is an innovative company focused on delivering exceptional products and services to our
                customers. We value creativity, collaboration, and continuous improvement in everything we do. Join our
                team and be part of something amazing while growing your career in a supportive environment.
              </p>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-right duration-500">
              <h3 className="font-bold mb-6 text-xl dark:text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                Job Details
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <h4 className="font-semibold text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide">
                    Level
                  </h4>
                  <p className="text-neutral-800 dark:text-neutral-200 font-medium text-lg">{job.level}</p>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <h4 className="font-semibold text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide">
                    Role
                  </h4>
                  <p className="text-neutral-800 dark:text-neutral-200 font-medium text-lg">{job.role}</p>
                </div>

                {job.languages.length > 0 && (
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <h4 className="font-semibold text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide mb-2">
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full font-medium dark:bg-neutral-600 dark:text-neutral-200"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.tools.length > 0 && (
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <h4 className="font-semibold text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide mb-2">
                      Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.tools.map((tool, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full font-medium dark:bg-neutral-600 dark:text-neutral-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-right duration-700">
                <h3 className="font-bold mb-6 text-xl dark:text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                  Benefits
                </h3>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                      <CheckCircle size={16} className="text-primary-500 mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {showApplyForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-neutral-800 p-6 border-b border-neutral-200 dark:border-neutral-700 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white">Apply for {job.position}</h2>
                    <p className="text-neutral-600 dark:text-neutral-400">at {job.company}</p>
                  </div>
                  <button
                    onClick={() => setShowApplyForm(false)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors duration-200"
                  >
                    <X size={24} className="text-neutral-500 dark:text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white transition-all duration-200"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">Cover Letter *</label>
                  <textarea
                    rows="5"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white transition-all duration-200 resize-none"
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">Resume/CV *</label>
                  <div className="relative">
                    <input
                      type="file"
                      name="resume"
                      onChange={handleInputChange}
                      required
                      accept=".pdf,.doc,.docx"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <Upload size={20} className="absolute right-3 top-3 text-neutral-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default JobDetail
