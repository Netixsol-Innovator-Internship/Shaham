import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Filter state
      filters: [],
      
      // Theme state
      darkMode: false,
      
      // Actions
      addFilter: (filter) => {
        const currentFilters = get().filters
        if (!currentFilters.includes(filter)) {
          set({ filters: [...currentFilters, filter] })
        }
      },
      
      removeFilter: (filter) => {
        const currentFilters = get().filters
        set({ filters: currentFilters.filter(f => f !== filter) })
      },
      
      clearFilters: () => {
        set({ filters: [] })
      },
      
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode
        set({ darkMode: newDarkMode })
        // Update the HTML class for dark mode
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newDarkMode)
        }
      },
    }),
    {
      name: 'job-listings-storage',
    }
  )
)