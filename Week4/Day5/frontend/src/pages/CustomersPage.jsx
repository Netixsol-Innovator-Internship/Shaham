import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const CustomersPage = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [actionLoading, setActionLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/users/customers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await res.json()
      if (res.ok) setCustomers(data)
      else console.error(data.message)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!user && !loading) navigate("/")
    if (user) fetchCustomers()
  }, [user, loading, navigate])

  const toggleBlock = async (customerId, blocked) => {
    try {
      setActionLoading(true)
      const res = await fetch(`${API_URL}/users/${blocked ? "unblock" : "block"}/${customerId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await res.json()
      if (res.ok) fetchCustomers()
      else console.error(data.message)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const promoteToAdmin = async (customerId) => {
    try {
      setActionLoading(true)
      const res = await fetch(`${API_URL}/users/role/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: "admin" }),
      })
      const data = await res.json()
      if (res.ok) fetchCustomers()
      else console.error(data.message)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  if (!user || loading) return <p>Loading customers...</p>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="space-y-4">
          {customers.map((c) => (
            <div key={c._id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-600">{c.email}</p>
                <p className="text-xs text-gray-500">Blocked: {c.blocked ? "Yes" : "No"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleBlock(c._id, c.blocked)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  disabled={actionLoading}
                >
                  {c.blocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => promoteToAdmin(c._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  disabled={actionLoading}
                >
                  Promote to Admin
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomersPage
