import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const AdminsPage = () => {
  const { user, loading, token } = useAuth()
  const navigate = useNavigate()
  const [admins, setAdmins] = useState([])
  const [actionLoading, setActionLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_URL}/users/admins`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await res.json()
      if (res.ok) {
        setAdmins(data)
      } else {
        console.error(data.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!user && !loading) navigate("/")
    if (user?.role === "superadmin") fetchAdmins()
  }, [user, loading, navigate])

  const toggleBlock = async (adminId, blocked) => {
    try {
      setActionLoading(true)
      const res = await fetch(`${API_URL}/users/${blocked ? "unblock" : "block"}/${adminId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await res.json()
      if (res.ok) fetchAdmins()
      else console.error(data.message)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const revertToCustomer = async (adminId) => {
    try {
      setActionLoading(true)
      const res = await fetch(`${API_URL}/users/role/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: "customer" }),
      })
      const data = await res.json()
      if (res.ok) fetchAdmins()
      else console.error(data.message)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  if (!user || loading) return <p>Loading...</p>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admins</h1>
      {admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <div className="space-y-4">
          {admins.map((a) => (
            <div key={a._id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <p className="font-semibold">{a.name}</p>
                <p className="text-sm text-gray-600">{a.email}</p>
                <p className="text-xs text-gray-500">Blocked: {a.blocked ? "Yes" : "No"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleBlock(a._id, a.blocked)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  disabled={actionLoading}
                >
                  {a.blocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => revertToCustomer(a._id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                  disabled={actionLoading}
                >
                  Revert to Customer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminsPage
