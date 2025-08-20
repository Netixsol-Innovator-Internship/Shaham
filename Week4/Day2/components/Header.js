import ThemeToggle from "./ThemeToggle"
import { Briefcase } from "lucide-react"

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/bg-header-mobile.svg')] md:bg-[url('/images/bg-header-desktop.svg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
      </div>
      <div className="container mx-auto px-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <Briefcase size={32} className="text-white" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Job Board</h1>
            <p className="text-primary-100 text-sm md:text-base">Find your dream job today</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
