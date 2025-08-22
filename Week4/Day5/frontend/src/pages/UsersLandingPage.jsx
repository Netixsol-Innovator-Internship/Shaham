import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const UsersLandingPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    if (user.role === "admin") {
      navigate("/users/customers")
    }
  }, [user, navigate])

  const goToCustomers = () => navigate("/users/customers")
  const goToAdmins = () => navigate("/users/admins")

  return (
    <div className="max-w-7xl mx-auto p-4">
      {user?.role === "superadmin" && (
        <div className="flex space-x-4">
          <button onClick={goToCustomers} className="px-4 py-2 bg-blue-500 text-white rounded">Customers</button>
          <button onClick={goToAdmins} className="px-4 py-2 bg-green-500 text-white rounded">Admins</button>
        </div>
      )}
    </div>
  )
}

export default UsersLandingPage
