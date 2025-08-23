
import { useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useGetAdminsQuery, useToggleBlockUserMutation, useSetUserRoleMutation } from "../redux/apiSlice"

const AdminsPage = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { data, refetch, isLoading } = useGetAdminsQuery(undefined, { skip: !user })
  const [toggleBlock] = useToggleBlockUserMutation()
  const [setRole] = useSetUserRoleMutation()

  useEffect(() => {
    if (!user && !loading) navigate("/")
  }, [user, loading, navigate])

  if (!user || isLoading) return <p>Loading...</p>

  const admins = data || []

  const onToggle = async (id, blocked) => {
    await toggleBlock({ id, blocked }).unwrap()
    refetch()
  }

  const revertToCustomer = async (id) => {
    await setRole({ id, role: "customer" }).unwrap()
    refetch()
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Admins</h1>
      <div className="space-y-4">
        {admins.map((a) => (
          <div key={a._id} className="flex justify-between items-center p-4 border rounded">
            <div>
              <p className="font-semibold">{a.name}</p>
              <p className="text-sm text-gray-600">{a.email}</p>
              <p className="text-xs text-gray-500">Blocked: {a.blocked ? "Yes" : "No"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onToggle(a._id, a.blocked)} className="px-3 py-1 bg-red-500 text-white rounded">
                {a.blocked ? "Unblock" : "Block"}
              </button>
              <button onClick={() => revertToCustomer(a._id)} className="px-3 py-1 bg-gray-800 text-white rounded">
                Revert to Customer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminsPage
