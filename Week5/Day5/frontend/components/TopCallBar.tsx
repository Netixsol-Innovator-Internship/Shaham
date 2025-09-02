export default function TopCallBar() {
  return (
    <div className="bg-[#3f4b8b] text-white py-2 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span>Call Us</span>
          <span className="font-medium">570-694-4002</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/mail icon.png" alt="" />
          <span>Email Id : info@cardeposit.com</span>
        </div>
      </div>
    </div>
  )
}
