import axios from "axios"

export function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    // Handle Axios-specific errors
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`
      return new Error(message)
    } else if (error.request) {
      // Request was made but no response received
      return new Error("Network error: Unable to connect to server")
    } else {
      // Something else happened
      return new Error(`Request error: ${error.message}`)
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return error
  }

  // Handle unknown error types
  return new Error("An unexpected error occurred")
}
