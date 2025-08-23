
"use client"

import { useState } from "react"
import { useAddProductMutation } from "../redux/apiSlice"

const AddProductModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    origin: "",
    category: "",
    stock: "",
    image: null,
  })
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")
  const [addProduct] = useAddProductMutation()

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAdding(true)
    setError("")
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
      await addProduct(fd).unwrap()
      if (onAdded) onAdded()
      onClose()
    } catch (err) {
      setError(err?.data?.message || "Failed to add product")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Product</h3>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Name" className="w-full border p-2 rounded" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="price" type="number" step="0.01" placeholder="Price" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="origin" placeholder="Origin" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="category" placeholder="Category" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="image" type="file" accept="image/*" className="w-full border p-2 rounded" onChange={handleChange} required />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border">Cancel</button>
            <button disabled={adding} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">{adding ? "Adding..." : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal
