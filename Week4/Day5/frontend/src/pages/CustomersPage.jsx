
import { useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useGetCustomersQuery, useToggleBlockUserMutation, useSetUserRoleMutation } from "../redux/apiSlice"

const CustomersPage = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { data, refetch, isLoading } = useGetCustomersQuery(undefined, { skip: !user })
  const [toggleBlock] = useToggleBlockUserMutation()
  const [setRole] = useSetUserRoleMutation()

  useEffect(() => {
    if (!user && !loading) navigate("/")
  }, [user, loading, navigate])

  if (!user || isLoading) return <p>Loading...</p>

  const customers = data || []

  const onToggle = async (id, blocked) => {
    await toggleBlock({ id, blocked }).unwrap()
    refetch()
  }

  const promoteToAdmin = async (id) => {
    await setRole({ id, role: "admin" }).unwrap()
    refetch()
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <div className="space-y-4">
        {customers.map((c) => (
          <div key={c._id} className="flex justify-between items-center p-4 border rounded">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-600">{c.email}</p>
              <p className="text-xs text-gray-500">Blocked: {c.blocked ? "Yes" : "No"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onToggle(c._id, c.blocked)} className="px-3 py-1 bg-red-500 text-white rounded">
                {c.blocked ? "Unblock" : "Block"}
              </button>
              <button onClick={() => promoteToAdmin(c._id)} className="px-3 py-1 bg-indigo-600 text-white rounded">
                Promote to Admin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomersPage
